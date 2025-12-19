import { useState } from "react";
import { Search, Coins, Plus, Minus, History as HistoryIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function UserCurrencyManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  const handleSearchUser = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username to search",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchTerm)}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("User not found");
      }
      
      const users = await response.json();
      if (users.length === 0) {
        toast({
          title: "Not Found",
          description: "No user found with that username",
          variant: "destructive",
        });
        return;
      }
      
      const user = users[0];
      setSelectedUserId(user.id);
      setSelectedUsername(user.username);
      
      toast({
        title: "User Found",
        description: `User: ${user.username} (Balance: ${user.currencyBalance || 0} coins)`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search user",
        variant: "destructive",
      });
    }
  };

  const handleAdjustment = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive",
      });
      return;
    }

    if (!adjustmentAmount || parseInt(adjustmentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!adjustmentReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for this adjustment",
        variant: "destructive",
      });
      return;
    }

    try {
      const endpoint = adjustmentType === "add" 
        ? "/api/currency/admin/add" 
        : "/api/currency/admin/deduct";
      
      await apiRequest("POST", endpoint, {
        userId: selectedUserId,
        amount: parseInt(adjustmentAmount),
        reason: adjustmentReason,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/currency/balance"] });
      setShowAdjustDialog(false);
      setAdjustmentAmount("");
      setAdjustmentReason("");
      
      toast({
        title: "Success",
        description: `Currency ${adjustmentType === "add" ? "added" : "deducted"} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to adjust currency",
        variant: "destructive",
      });
    }
  };

  const openAdjustDialog = (type: "add" | "deduct") => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please search and select a user first",
        variant: "destructive",
      });
      return;
    }
    setAdjustmentType(type);
    setShowAdjustDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Currency Management</h2>
        <p className="text-muted-foreground">Manually adjust user currency balances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search User</CardTitle>
          <CardDescription>Find a user by username to manage their currency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
              />
            </div>
            <Button onClick={handleSearchUser}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedUserId && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Selected User</CardTitle>
              <CardDescription>User: {selectedUsername}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={() => openAdjustDialog("add")} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Currency
                </Button>
                <Button onClick={() => openAdjustDialog("deduct")} variant="destructive" className="flex-1">
                  <Minus className="w-4 h-4 mr-2" />
                  Deduct Currency
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View currency transaction history for this user</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transaction history will appear here. Use the admin panel to view full details.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Adjustment Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === "add" ? "Add" : "Deduct"} Currency
            </DialogTitle>
            <DialogDescription>
              {adjustmentType === "add" ? "Grant" : "Remove"} currency {adjustmentType === "add" ? "to" : "from"} user: {selectedUsername}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Provide a reason for this adjustment..."
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustment}>
              {adjustmentType === "add" ? "Add" : "Deduct"} Currency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
