import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp } from "lucide-react";

interface LoyaltyTier {
  id: string;
  name: string;
  requiredPoints: number;
  benefits: string;
  iconName: string;
  displayOrder: number;
}

interface UserLoyalty {
  points: number;
  lifetimePoints: number;
  tier: LoyaltyTier | null;
}

export default function Loyalty() {
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const [loyaltyRes, tiersRes] = await Promise.all([
        fetch("/api/loyalty/status", { credentials: "include" }),
        fetch("/api/loyalty/tiers", { credentials: "include" })
      ]);

      if (loyaltyRes.ok) {
        const data = await loyaltyRes.json();
        setLoyalty(data);
      }

      if (tiersRes.ok) {
        const data = await tiersRes.json();
        setTiers(data);
      }
    } catch (error) {
      console.error("Failed to fetch loyalty data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading loyalty program...</div>
      </div>
    );
  }

  const currentTier = loyalty?.tier || tiers[0];
  const currentTierIndex = tiers.findIndex(t => t.id === currentTier?.id) || 0;
  const nextTier = tiers[currentTierIndex + 1];
  const pointsToNextTier = nextTier ? nextTier.requiredPoints - (loyalty?.points || 0) : 0;
  const tierProgress = nextTier 
    ? ((loyalty?.points || 0) / nextTier.requiredPoints) * 100 
    : 100;

  const getTierIcon = (iconName: string) => {
    const colors: Record<string, string> = {
      bronze: "text-orange-700",
      silver: "text-gray-400",
      gold: "text-yellow-500",
      platinum: "text-purple-500",
      diamond: "text-blue-400"
    };
    return colors[iconName] || "text-gray-500";
  };

  const parseBenefits = (benefitsJson: string) => {
    try {
      const benefits = JSON.parse(benefitsJson);
      return [
        benefits.coinBonus ? `${benefits.coinBonus}% coin bonus on purchases` : null,
        benefits.discountPercent ? `${benefits.discountPercent}% discount on all purchases` : null
      ].filter(Boolean);
    } catch {
      return [];
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Loyalty Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Award className={`h-8 w-8 ${getTierIcon(currentTier?.iconName || "")}`} />
                {currentTier?.name} Tier
              </h3>
              <p className="text-muted-foreground">
                {loyalty?.points || 0} loyalty points
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Lifetime Points</div>
              <div className="text-2xl font-bold">{loyalty?.lifetimePoints || 0}</div>
            </div>
          </div>

          {nextTier && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {nextTier.name}</span>
                <span>{pointsToNextTier} points needed</span>
              </div>
              <Progress value={tierProgress} className="h-3" />
            </div>
          )}

          {currentTier && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Your Benefits</h4>
              <ul className="space-y-1">
                {parseBenefits(currentTier.benefits).map((benefit, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Tiers</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => {
            const isCurrentTier = tier.id === currentTier?.id;
            const isUnlocked = (loyalty?.points || 0) >= tier.requiredPoints;

            return (
              <Card
                key={tier.id}
                className={`
                  ${isCurrentTier ? "border-primary ring-2 ring-primary" : ""}
                  ${isUnlocked ? "border-green-500" : "opacity-70"}
                `}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Award className={`h-10 w-10 ${getTierIcon(tier.iconName)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {tier.name}
                        {isCurrentTier && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </h4>
                      <div className="text-xs text-muted-foreground mb-2">
                        {tier.requiredPoints} points required
                      </div>
                      <ul className="space-y-1">
                        {parseBenefits(tier.benefits).map((benefit, i) => (
                          <li key={i} className="text-xs flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
