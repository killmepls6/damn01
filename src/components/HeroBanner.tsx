import { useState, useEffect } from "react";
import { Star, Heart, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface HeroItem {
  id: string;
  title: string;
  chapter?: string;
  description?: string;
  rating?: number;
  genres?: string[];
  coverImageUrl?: string;
  status: "Ongoing" | "Completed";
  author?: string;
  updatedAt?: string;
}

export default function HeroBanner() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchFeaturedSeries = async () => {
      try {
        const response = await fetch('/api/sections/featured');
        if (response.ok) {
          const data = await response.json();
          setHeroItems(data);
        }
      } catch (error) {
        console.error('[HeroBanner] Error loading featured series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSeries();
  }, []);

  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  
  // Initialize position at middle set when items load
  useEffect(() => {
    if (heroItems.length > 0) {
      setTranslateX(-(305 * heroItems.length));
    }
  }, [heroItems.length]);

  // Create duplicated items for infinite scroll
  const duplicatedItems = heroItems.length > 0 ? [...heroItems, ...heroItems, ...heroItems] : [];

  // Smooth continuous sliding animation with seamless loop
  useEffect(() => {
    if (isPaused || heroItems.length === 0) return;
    
    let animationId: number;
    const moveSpeed = 0.6;
    
    const animate = () => {
      setTranslateX(prev => {
        const cardWidth = 305;
        const newTranslateX = prev - moveSpeed;
        
        const singleSetWidth = cardWidth * heroItems.length;
        const resetThreshold = -singleSetWidth * 2;
        
        if (newTranslateX <= resetThreshold) {
          return newTranslateX + singleSetWidth;
        }
        
        return newTranslateX;
      });
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [heroItems.length, isPaused]);

  const goToPrevious = () => {
    const cardWidth = 305;
    setTranslateX(prev => {
      const newTranslateX = prev + cardWidth;
      const middlePoint = -cardWidth * heroItems.length;
      
      if (newTranslateX >= 0) {
        return middlePoint;
      }
      
      return newTranslateX;
    });
  };

  const goToNext = () => {
    const cardWidth = 305;
    setTranslateX(prev => {
      const newTranslateX = prev - cardWidth;
      const resetPoint = -cardWidth * heroItems.length * 2;
      const middlePoint = -cardWidth * heroItems.length;
      return newTranslateX <= resetPoint ? middlePoint : newTranslateX;
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg">Loading featured series...</p>
        </div>
      </div>
    );
  }

  if (heroItems.length === 0) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        {/* Modern Background Pattern with Anime Aesthetics */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(138,43,226,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,20,147,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:60px_60px] opacity-40" />
        
        {/* Header Section */}
        <div className="relative z-10 text-center pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4 sm:mb-6 tracking-tight">
              Featured Series
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-400 font-light leading-relaxed mb-8">
              Discover amazing manga and manhwa series
            </p>
          </div>
        </div>

        <div className="relative z-10 text-center py-12">
          <div className="text-center py-8 bg-muted/30 rounded-lg mx-8">
            <p className="text-muted-foreground">
              No featured series assigned yet. Use the admin panel to assign series to this section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      

      {/* Horizontal Banner */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-1 w-full h-full flex items-center">
        <div className="relative max-w-none lg:max-w-[95vw] mx-auto w-full">
          
          {/* Banner Container */}
          <div className="relative overflow-hidden h-[60%]">
            {/* Cards Container */}
            <div 
              className="flex h-full"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: isPaused ? 'transform 0.3s ease-out' : 'none'
              }}
            >
              {duplicatedItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex-shrink-0 w-[300px] px-2.5 cursor-pointer h-full flex items-center bg-transparent"
                  onClick={() => navigate(`/manga/${item.id}`)}
                  data-testid={`hero-card-${item.id}`}
                >
                  {/* Clean Card Design */}
                  <div className="relative w-full h-[85%] max-w-[300px] mx-auto" style={{aspectRatio: '3/4'}}>
                    {/* Cover Image */}
                    <img
                      src={item.coverImageUrl || '/api/covers/placeholder'}
                      alt={item.title}
                      className="absolute inset-0 w-[95%] h-[95%] object-cover object-center m-auto rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/api/covers/placeholder') {
                          target.src = '/api/covers/placeholder';
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
