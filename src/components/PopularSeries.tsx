import { useState, useEffect } from "react";
import { Star, TrendingUp, Crown, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface PopularItem {
  id: string;
  rank: number;
  title: string;
  coverImageUrl?: string;
  rating?: number;
  status: string;
  genres?: string[];
}

export default function PopularSeries() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "all">("weekly");
  const [popularSeries, setPopularSeries] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchPopularSeries = async () => {
      try {
        const response = await fetch('/api/sections/popular-today');
        if (response.ok) {
          const data = await response.json();
          // Add rank to items
          const dataWithRank = data.map((item: any, index: number) => ({
            ...item,
            rank: index + 1
          }));
          setPopularSeries(dataWithRank);
        }
      } catch (error) {
        // Error fetching popular series - fail silently and show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchPopularSeries();
  }, []);

  const tabs = [
    { key: "weekly" as const, label: "Weekly" },
    { key: "monthly" as const, label: "Monthly" },
    { key: "all" as const, label: "All Time" }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm rounded-lg border border-card-border/50 p-6 shadow-lg shadow-primary/5">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading popular series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm rounded-lg border border-card-border/50 p-6 shadow-lg shadow-primary/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary drop-shadow-sm" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Popular Series</span>
        </h2>
      </div>

      {popularSeries.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            No popular series assigned yet. Use the admin panel to assign series to this section.
          </p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gradient-to-r from-muted via-muted to-muted/90 backdrop-blur-sm rounded-lg p-1 border border-muted-foreground/10">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 transition-all duration-300 ${
                  activeTab === tab.key 
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 backdrop-blur-sm' 
                    : 'hover:bg-primary/10 hover:text-primary backdrop-blur-sm'
                }`}
                data-testid={`popular-tab-${tab.key}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Series List */}
          <div className="space-y-3">
        {popularSeries.map((series, index) => {
          const getRankDisplay = () => {
            if (series.rank === 1) {
              return (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              );
            }
            if (series.rank === 2) {
              return (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <Medal className="w-4 h-4 text-white" />
                </div>
              );
            }
            if (series.rank === 3) {
              return (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-4 h-4 text-white" />
                </div>
              );
            }
            return (
              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {series.rank}
                </span>
              </div>
            );
          };

          return (
            <div
              key={series.id}
              onClick={() => navigate(`/manga/${series.id}`)}
              className={`flex items-center space-x-3 p-2 rounded-lg hover-elevate cursor-pointer group ${
                series.rank <= 3 ? 'bg-gradient-to-r from-card to-card/50 border-l-2 ' +
                (series.rank === 1 ? 'border-l-yellow-400' : 
                 series.rank === 2 ? 'border-l-gray-400' : 'border-l-orange-400') : ''
              }`}
              data-testid={`popular-series-${series.id}`}
            >
              {/* Rank */}
              {getRankDisplay()}

            {/* Thumbnail */}
            <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0">
              {series.coverImageUrl ? (
                <img
                  src={series.coverImageUrl}
                  alt={series.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No cover</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                {series.title}
              </h4>
              
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{series.rating}</span>
                </div>
                
                <Badge 
                  variant={series.status === "Ongoing" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {series.status}
                </Badge>
              </div>
              
              {series.genres && series.genres.length > 0 && (
                <div className="flex space-x-1 mt-1">
                  {series.genres.slice(0, 2).map((genre) => (
                    <span key={genre} className="text-xs text-muted-foreground">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            </div>
          );
        })}
      </div>

          {/* View More */}
          <Button 
            variant="outline" 
            className="w-full mt-4 bg-gradient-to-r from-transparent to-transparent hover:from-primary/10 hover:to-accent/10 backdrop-blur-sm border-card-border/50 hover:border-primary/30 transition-all duration-300" 
            data-testid="view-more-popular"
            onClick={() => navigate("/browse?sort=popular")}
          >
            View More Popular Series
          </Button>
        </>
      )}
    </div>
  );
}