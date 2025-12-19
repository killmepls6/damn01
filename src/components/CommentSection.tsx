import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Edit2, Trash2, Send, AlertCircle } from "lucide-react";

interface CommentWithUser {
  id: string;
  userId: string;
  seriesId: string | null;
  chapterId: string | null;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
  user: {
    id: string;
    username: string | null;
    profilePicture: string | null;
    profileImageUrl: string | null;
  };
}

interface CommentSectionProps {
  seriesId?: string;
  chapterId?: string;
}

export default function CommentSection({ seriesId, chapterId }: CommentSectionProps) {
  const { user, isStaffOrAbove } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const maxLength = 1000;

  const queryKey = seriesId 
    ? ['comments', 'series', seriesId]
    : ['comments', 'chapter', chapterId];

  const endpoint = seriesId 
    ? `/api/series/${seriesId}/comments`
    : `/api/chapters/${chapterId}/comments`;

  const { data: comments = [], isLoading, error, isError } = useQuery<CommentWithUser[]>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(endpoint, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      
      return response.json();
    },
    retry: false,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", endpoint, { content });
      return response.json();
    },
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousComments = queryClient.getQueryData<CommentWithUser[]>(queryKey);
      
      if (user) {
        const optimisticComment: CommentWithUser = {
          id: `temp-${Date.now()}`,
          userId: user.id,
          seriesId: seriesId || null,
          chapterId: chapterId || null,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture || null,
            profileImageUrl: user.profileImageUrl || null,
          },
        };
        
        queryClient.setQueryData<CommentWithUser[]>(
          queryKey,
          (old = []) => [optimisticComment, ...old]
        );
      }
      
      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
      
      toast({
        title: "Failed to post comment",
        description: error.message || "Unable to post your comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await apiRequest("PATCH", `/api/comments/${commentId}`, { content });
      return response.json();
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousComments = queryClient.getQueryData<CommentWithUser[]>(queryKey);
      
      queryClient.setQueryData<CommentWithUser[]>(
        queryKey,
        (old = []) => old.map(comment =>
          comment.id === commentId
            ? { ...comment, content, updatedAt: new Date().toISOString() }
            : comment
        )
      );
      
      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditingId(null);
      setEditContent("");
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
      
      toast({
        title: "Failed to update comment",
        description: error.message || "Unable to update your comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousComments = queryClient.getQueryData<CommentWithUser[]>(queryKey);
      
      queryClient.setQueryData<CommentWithUser[]>(
        queryKey,
        (old = []) => old.filter(comment => comment.id !== commentId)
      );
      
      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
      
      toast({
        title: "Failed to delete comment",
        description: error.message || "Unable to delete your comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || createCommentMutation.isPending) return;
    createCommentMutation.mutate(newComment.trim());
  };

  const handleStartEdit = (comment: CommentWithUser) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim() || updateCommentMutation.isPending) return;
    updateCommentMutation.mutate({ commentId, content: editContent.trim() });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    deleteCommentMutation.mutate(commentId);
  };

  const getProfileImage = (comment: CommentWithUser) => {
    return comment.user.profileImageUrl || comment.user.profilePicture || undefined;
  };

  const getUserInitials = (comment: CommentWithUser) => {
    const username = comment.user.username || "User";
    return username.substring(0, 2).toUpperCase();
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Just now";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 border border-white/10 bg-white/5 rounded-xl">
        <div className="flex items-center gap-2 text-white/60 mb-4">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-6 border border-white/10 bg-white/5 rounded-xl">
        <div className="flex items-center gap-2 text-white mb-4">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load comments. Please try refreshing the page."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full p-6 border border-white/10 bg-white/5 rounded-xl">
      <div className="flex items-center gap-2 text-white mb-4">
        <MessageSquare className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value.slice(0, maxLength))}
              placeholder="Share your thoughts..."
              className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none"
              disabled={createCommentMutation.isPending}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm ${newComment.length > maxLength * 0.9 ? 'text-red-400' : 'text-white/40'}`}>
                {newComment.length} / {maxLength}
              </span>
              <Button
                type="submit"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createCommentMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Posting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Post Comment
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center text-white/60">
          Please log in to leave a comment
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No comments yet</p>
            <p className="text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getProfileImage(comment)} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getUserInitials(comment)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-white">
                        {comment.user.username || "Anonymous"}
                      </span>
                      <span className="text-sm text-white/40 ml-2">
                        {formatTimestamp(comment.createdAt)}
                        {comment.updatedAt !== comment.createdAt && " (edited)"}
                      </span>
                    </div>

                    {user && (user.id === comment.userId || isStaffOrAbove) && (
                      <div className="flex gap-2">
                        {editingId !== comment.id && (
                          <>
                            {user.id === comment.userId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(comment)}
                                className="text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deleteCommentMutation.isPending}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title={isStaffOrAbove && user.id !== comment.userId ? "Moderate as staff" : "Delete comment"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {editingId === comment.id ? (
                    <div>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value.slice(0, maxLength))}
                        className="min-h-[80px] bg-white/10 border-white/20 text-white mb-2 resize-none"
                        disabled={updateCommentMutation.isPending}
                      />
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${editContent.length > maxLength * 0.9 ? 'text-red-400' : 'text-white/40'}`}>
                          {editContent.length} / {maxLength}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            disabled={updateCommentMutation.isPending}
                            className="text-white/60 hover:text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(comment.id)}
                            disabled={!editContent.trim() || updateCommentMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {updateCommentMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/80 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
