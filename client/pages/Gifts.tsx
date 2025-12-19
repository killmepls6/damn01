import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Send, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface GiftTransaction {
  id: string;
  senderEmail?: string;
  giftType: string;
  giftAmount?: number;
  message?: string;
  status: string;
  createdAt: string;
}

export default function Gifts() {
  const { user } = useUser();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [receivedGifts, setReceivedGifts] = useState<GiftTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReceivedGifts();
  }, []);

  const fetchReceivedGifts = async () => {
    try {
      const response = await fetch("/api/gifts/received", {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setReceivedGifts(data);
      }
    } catch (error) {
      console.error("Failed to fetch gifts:", error);
    }
  };

  const sendGift = async () => {
    if (!recipientEmail || !amount || parseInt(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid email and amount"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/gifts/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          recipientEmail,
          giftType: "coins",
          giftAmount: parseInt(amount),
          message
        })
      });

      if (response.ok) {
        toast({
          title: "Gift Sent!",
          description: `Sent ${amount} coins to ${recipientEmail}`
        });
        setRecipientEmail("");
        setAmount("");
        setMessage("");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send gift"
      });
    } finally {
      setLoading(false);
    }
  };

  const claimGift = async (giftId: string) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}/claim`, {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Gift Claimed!",
          description: `You received ${data.amount} coins!`
        });
        fetchReceivedGifts();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to claim gift"
      });
    }
  };

  const pendingGifts = receivedGifts.filter(g => g.status === "pending");
  const claimedGifts = receivedGifts.filter(g => g.status === "claimed");

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send a Gift
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="amount">Coin Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your balance: {user?.currencyBalance || 0} coins
              </p>
            </div>
            <div>
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Hope you enjoy these coins!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={sendGift} disabled={loading} className="w-full">
              <Gift className="h-4 w-4 mr-2" />
              Send Gift
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Received Gifts ({pendingGifts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingGifts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No pending gifts
              </p>
            ) : (
              <div className="space-y-3">
                {pendingGifts.map(gift => (
                  <div key={gift.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{gift.giftAmount} Coins</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(gift.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => claimGift(gift.id)}>
                        Claim
                      </Button>
                    </div>
                    {gift.message && (
                      <p className="text-sm text-muted-foreground italic">
                        "{gift.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {claimedGifts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Previously Claimed</h4>
                <div className="space-y-2">
                  {claimedGifts.slice(0, 3).map(gift => (
                    <div key={gift.id} className="text-sm p-2 bg-muted rounded">
                      {gift.giftAmount} coins - Claimed
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
