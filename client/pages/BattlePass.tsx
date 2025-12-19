import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Star, Lock, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BattlePassProgress {
  currentTier: number;
  experience: number;
  isPremium: string;
  season: {
    name: string;
    description: string;
    maxTier: number;
    endDate: string;
  };
}

export default function BattlePass() {
  const [progress, setProgress] = useState<BattlePassProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/battle-pass/progress", {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error("Failed to fetch battle pass:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (tier: number) => {
    try {
      const response = await fetch(`/api/battle-pass/claim/${tier}`, {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Reward Claimed!",
          description: `You received your tier ${tier} reward!`
        });
        fetchProgress();
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
        description: "Failed to claim reward"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading battle pass...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">No active battle pass season</div>
      </div>
    );
  }

  const isPremium = progress.isPremium === "true";
  const tierProgress = ((progress.currentTier) / progress.season.maxTier) * 100;
  const daysLeft = Math.ceil(
    (new Date(progress.season.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const tiers = Array.from({ length: Math.min(20, progress.season.maxTier) }, (_, i) => i + 1);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              {progress.season.name}
            </div>
            {!isPremium && (
              <Button variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                Upgrade to Premium
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{progress.season.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{progress.currentTier}</div>
              <div className="text-xs text-muted-foreground">Current Tier</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{daysLeft}</div>
              <div className="text-xs text-muted-foreground">Days Left</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Season Progress</span>
              <span>{progress.currentTier} / {progress.season.maxTier}</span>
            </div>
            <Progress value={tierProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-4">Tier Rewards</h3>
        
        <div className="grid gap-3">
          {tiers.map(tier => {
            const isUnlocked = tier <= progress.currentTier;
            const isPremiumReward = tier % 10 === 0;
            const rewardCoins = isPremiumReward ? tier * 20 : tier * 5;

            return (
              <Card
                key={tier}
                className={`
                  ${isUnlocked ? "border-primary" : "opacity-60"}
                  ${isPremiumReward && !isPremium ? "border-yellow-500" : ""}
                `}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${isUnlocked ? "bg-primary text-white" : "bg-muted"}
                      `}>
                        {isUnlocked ? <Star className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          Tier {tier}
                          {isPremiumReward && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          {rewardCoins} coins
                        </div>
                      </div>
                    </div>
                    
                    {isUnlocked && (
                      <Button
                        size="sm"
                        variant={isPremiumReward && !isPremium ? "outline" : "default"}
                        onClick={() => claimReward(tier)}
                        disabled={isPremiumReward && !isPremium}
                      >
                        {isPremiumReward && !isPremium ? "Premium Only" : "Claim"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
