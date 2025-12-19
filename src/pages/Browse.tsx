import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Lock, Bookmark, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SeriesCardSkeleton from "@/components/ui/SeriesCardSkeleton";
import { SEO } from "@/components/SEO";
import { BannerAd } from "@/components/AdDisplay";

interface LatestChapter {
  id: string;
  chapterNumber: string;
  title?: string;
  createdAt: string;
  totalPages: number;
}

interface Series {
  id: string;
  title: string;
  coverImageUrl?: string;
  rating?: number;
  status: string;
  genres?: string[];
  updatedAt?: string;
  chapterCount?: number;
  latestChapters?: LatestChapter[];
}

export default function Browse() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'new'>('all');
  const [location, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    
    if (filter === 'hot' || filter === 'popular') {
      setActiveFilter('hot');
    } else if (filter === 'new' || filter === 'latest') {
      setActiveFilter('new');
    } else if (filter === 'all') {
      setActiveFilter('all');
    }
  }, [location]);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/series';
        
        if (activeFilter === 'hot') {
          endpoint = '/api/sections/popular-today';
        } else if (activeFilter === 'new') {
          endpoint = '/api/sections/latest-updates';
        }
        
        const response = await fetch(endpoint, {
          cache: 'no-cache'
        });
        if (response.ok) {
          const data = await response.json();
          setSeries(data);
        }
      } catch (error) {
        // Error fetching series - fail silently and show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <SEO 
        title="Browse Manga"
        description="Browse our extensive collection of manga and manhwa. Filter by genre, status, and popularity to find your next favorite series."
        keywords="browse manga, manga collection, manhwa library, manga genres"
      />
      <Navigation />
      
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with filters */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">All Series</h1>
          
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === 'all' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              📚 All
            </Button>
            <Button 
              variant={activeFilter === 'hot' ? 'default' : 'outline'}
              size="sm" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === 'hot' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}
              onClick={() => setActiveFilter('hot')}
            >
              🔥 Hot
            </Button>
            <Button 
              variant={activeFilter === 'new' ? 'default' : 'outline'}
              size="sm" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === 'new' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}
              onClick={() => setActiveFilter('new')}
            >
              🆕 New
            </Button>
          </div>
        </div>

        <BannerAd page="search_results" location="top_banner" className="mb-8" />

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[4vw] sm:gap-6 w-full">
            {[...Array(8)].map((_, i) => (
              <SeriesCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && series.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">
              No series found.
            </p>
          </div>
        )}

        {/* Series grid */}
        {!loading && series.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[4vw] sm:gap-6 w-full">
            {series.map((item) => (
              <MangaCard 
                key={item.id}
                item={item}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reuse the same MangaCard component from PopularToday
function MangaCard({ item, navigate }: { 
  item: Series; 
  navigate: (path: string) => void;
}) {
  const [visibleChapters, setVisibleChapters] = useState(4);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateVisibleChapters = () => {
      if (!cardRef.current || !contentRef.current || !titleRef.current) return;

      const cardHeight = cardRef.current.offsetHeight;
      const titleHeight = titleRef.current.offsetHeight;
      const padding = 32;
      const availableHeight = cardHeight - titleHeight - padding;
      
      const chapterHeight = 28;
      const maxChapters = Math.floor(availableHeight / chapterHeight);
      
      const chaptersToShow = Math.max(1, Math.min(maxChapters, 4));
      setVisibleChapters(chaptersToShow);
    };

    calculateVisibleChapters();
    
    const resizeObserver = new ResizeObserver(calculateVisibleChapters);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Use real chapter data from the API
  const latestChapters = item.latestChapters || [];
  const hasChapters = latestChapters.length > 0;

  return (
    <div
      ref={cardRef}
      className="group anime-card bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md rounded-2xl border border-border/40 p-0 transition-all duration-300 hover:border-primary/60 hover:from-card/90 hover:to-card/80 relative overflow-hidden hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02]"
      style={{ aspectRatio: '4.5 / 2.5' }}
      data-testid={`series-item-${item.id}`}
    >
      <div className="flex h-full">
        {/* Cover Image - Left Side */}
        <div 
          className="relative cursor-pointer flex-shrink-0" 
          onClick={() => navigate(`/manga/${item.id}`)}
          style={{ width: '42%' }}
        >
          <div className="relative w-full h-full overflow-hidden">
            {item.coverImageUrl ? (
              <img
                src={item.coverImageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted/60 flex items-center justify-center">
                <span className="text-muted-foreground text-xs font-medium">No cover</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/10"></div>
            
            {/* Genre Badge */}
            <div className="absolute top-2 left-2">
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] px-2 py-1 rounded-full font-medium shadow-lg backdrop-blur-sm border border-primary/20">
                {item.genres?.[0] || 'Manhwa'}
              </Badge>
            </div>
            
            {/* Pinned Badge */}
            <div className="absolute bottom-2 left-2">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                <Bookmark className="w-3 h-3 text-white" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Content - Right Side */}
        <div ref={contentRef} className="flex flex-col min-w-0 p-2 sm:p-3 lg:p-4" style={{ width: '58%' }}>
          {/* Title and Rating */}
          <div ref={titleRef} className="mb-2 sm:mb-3 flex-shrink-0">
            <h3 className="text-foreground font-bold text-xs sm:text-sm lg:text-base line-clamp-2 mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 leading-tight break-words">
              {item.title}
            </h3>
          </div>
          
          {/* Chapter List - Dynamic based on available space */}
          <div className="space-y-1 flex-1">
            {!hasChapters ? (
              <div className="text-muted-foreground text-xs text-center py-2">
                No chapters yet
              </div>
            ) : (
              latestChapters.slice(0, visibleChapters).map((chapter, index) => {
                const isRecent = chapter.createdAt && 
                  new Date(chapter.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // within 7 days
                const timeAgo = chapter.createdAt 
                  ? formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true })
                  : '';
                
                return (
                  <div 
                    key={chapter.id}
                    className={`group/chapter transition-all duration-300 cursor-pointer hover:shadow-md ${
                      index === 0 
                        ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 hover:from-primary/20 hover:to-accent/20 hover:border-primary/50 relative overflow-hidden'
                        : index === 1
                        ? 'bg-card/40 border border-border/20 hover:bg-card/60 hover:border-border/40'
                        : 'bg-card/30 border border-border/10 hover:bg-card/50 hover:border-border/30'
                    } rounded-md px-2 py-1`}
                  >
                    {index === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/chapter:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <div className="flex items-center justify-between relative z-10 min-w-0">
                      <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                        <div className="w-2.5 h-2.5 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full"></div>
                        </div>
                        <span className={`font-medium truncate text-[11px] sm:text-xs ${
                          index === 0 ? 'text-foreground' : index === 1 ? 'text-foreground/90' : 'text-foreground/80'
                        }`}>
                          Chapter {chapter.chapterNumber}
                        </span>
                        {isRecent && index === 0 && (
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] px-1 py-0.5 rounded-full font-medium shadow-sm hidden sm:inline-flex items-center">
                            <Flame className="w-2 h-2" />
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground text-[9px] sm:text-[10px] font-medium flex-shrink-0 ml-1">
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
