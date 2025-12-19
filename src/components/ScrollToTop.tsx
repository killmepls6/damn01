import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if we're on signup page
  const isSignupPage = location === '/signup' || location.startsWith('/signup?');

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && !isSignupPage && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              relative w-14 h-14 rounded-full border-0 shadow-2xl transition-all duration-500 ease-out
              bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500
              hover:from-purple-700 hover:via-pink-600 hover:to-blue-600
              hover:scale-110 hover:shadow-purple-500/50 hover:shadow-2xl
              active:scale-95 active:duration-75
              backdrop-blur-sm overflow-hidden
              ${isHovered ? 'animate-pulse' : ''}
            `}
            data-testid="scroll-to-top-button"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Anime-style glow effect */}
            <div className={`
              absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
              opacity-0 blur-lg transition-all duration-500
              ${isHovered ? 'opacity-60 scale-150' : 'opacity-0 scale-100'}
            `} />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className={`
                absolute top-1 left-1 w-1 h-1 bg-white/80 rounded-full 
                transition-all duration-700 ease-out
                ${isHovered ? 'translate-x-8 translate-y-8 opacity-0' : 'translate-x-0 translate-y-0 opacity-100'}
              `} />
              <div className={`
                absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full 
                transition-all duration-1000 ease-out delay-150
                ${isHovered ? 'translate-x-6 translate-y-6 opacity-0' : 'translate-x-0 translate-y-0 opacity-100'}
              `} />
              <div className={`
                absolute bottom-2 left-2 w-1 h-1 bg-white/70 rounded-full 
                transition-all duration-800 ease-out delay-75
                ${isHovered ? 'translate-x-8 -translate-y-8 opacity-0' : 'translate-x-0 translate-y-0 opacity-100'}
              `} />
            </div>
            
            {/* Icon with bounce animation */}
            <ChevronUp 
              className={`
                relative z-10 w-6 h-6 text-white transition-all duration-300
                ${isHovered ? 'animate-bounce scale-110' : ''}
              `} 
            />
            
            {/* Shimmer effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              transform -skew-x-12 transition-all duration-700 ease-out
              ${isHovered ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'}
            `} />
          </Button>
          
          {/* Tooltip */}
          <div className={`
            absolute bottom-16 right-0 mb-2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg
            backdrop-blur-sm transition-all duration-300 whitespace-nowrap
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
          `}>
            Back to top
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
          </div>
        </div>
      )}
    </>
  );
}