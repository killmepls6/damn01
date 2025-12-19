import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, Check, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCode {
  code: string;
  uses: number;
  coinRewardReferrer: number;
  coinRewardReferred: number;
}

interface Referral {
  id: string;
  referredId: string;
  createdAt: string;
  referrerRewardAmount: number;
  status: string;
}

export default function Referrals() {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [applyCode, setApplyCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [codeRes, referralsRes] = await Promise.all([
        fetch("/api/referrals/my-code", { credentials: "include" }),
        fetch("/api/referrals/my-referrals", { credentials: "include" })
      ]);

      if (codeRes.ok) {
        const codeData = await codeRes.json();
        setReferralCode(codeData);
      }

      if (referralsRes.ok) {
        const referralsData = await referralsRes.json();
        setReferrals(referralsData);
      }
    } catch (error) {
      console.error("Failed to fetch referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyReferralCode = async () => {
    if (!applyCode.trim()) return;

    try {
      const response = await fetch("/api/referrals/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: applyCode })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Referral Applied!",
          description: `You received ${data.coinsEarned} coins!`
        });
        setApplyCode("");
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
        description: "Failed to apply referral code"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading referral data...</div>
      </div>
    );
  }

  const totalEarned = referrals.reduce((sum, ref) => sum + ref.referrerRewardAmount, 0);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Refer Friends & Earn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Your Referral Code</h3>
            <div className="flex gap-2">
              <Input
                value={referralCode?.code || ""}
                readOnly
                className="font-mono text-lg"
              />
              <Button onClick={copyCode} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share this code with friends. They get {referralCode?.coinRewardReferred} coins and you get {referralCode?.coinRewardReferrer} coins!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">{referrals.length}</div>
                <div className="text-sm text-muted-foreground">Successful Referrals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{totalEarned}</div>
                <div className="text-sm text-muted-foreground">Coins Earned</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Have a Referral Code?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter referral code"
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
            />
            <Button onClick={applyReferralCode}>Apply</Button>
          </div>
        </CardContent>
      </Card>

      {referrals.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referrals.map(referral => (
                <div key={referral.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm">
                        User joined via your code
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">
                    +{referral.referrerRewardAmount} coins
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
