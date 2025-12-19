import { Skeleton } from "@/components/ui/skeleton";

export default function MangaDetailSkeleton() {
  return (
    <div className="bg-[--theme_color] text-white select-none min-h-screen" style={{ '--theme_color': '#090000', '--header': '#030303', '--footer': '#030303', '--button': '#09090b' } as React.CSSProperties}>
      {/* Header Skeleton */}
      <header className="grid sm:-mb-4 -mb-[4vw] sm:relative transition-all duration-300 sticky top-0 left-0 z-[161] border-white/5">
        <div className="grid sm:gap-10 gap-[4vw] w-full 2xl:max-w-[100rem] max-w-6xl mx-auto sm:p-4 p-[4vw]">
          <div className="flex justify-between items-center">
            <div className="flex sm:gap-4 gap-[4vw] items-center">
              <Skeleton className="w-11 h-11 rounded-full" />
              <Skeleton className="sm:block hidden w-32 h-7" />
            </div>
            <Skeleton className="sm:hidden w-32 h-7" />
            <Skeleton className="sm:w-32 w-11 h-11 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="grid sm:gap-10 gap-[4vw] w-full 2xl:max-w-[100rem] max-w-6xl mx-auto sm:p-4 p-[4vw]">
        <div className="flex w-full sm:gap-10 gap-[4vw] relative">
          <div className="grid sm:gap-10 gap-[4vw] w-full h-fit">
            <div className="grid sm:gap-10 gap-[4vw]">
              <div className="flex lg:flex-row flex-col sm:gap-10 gap-[4vw]">
                {/* Cover Image Skeleton */}
                <div className="lg:block flex">
                  <div className="grid border border-white/10 overflow-hidden rounded-xl sm:w-64 w-1/2">
                    <Skeleton className="aspect-[0.75/1] rounded-none" />
                  </div>
                </div>
                
                {/* Info Section Skeleton */}
                <div className="grid sm:gap-6 gap-[4vw] h-fit flex-1">
                  <div className="grid sm:gap-4 gap-[4vw]">
                    {/* Title Skeleton */}
                    <div className="space-y-3">
                      <Skeleton className="h-12 sm:h-16 w-full" />
                      <Skeleton className="h-12 sm:h-16 w-3/4" />
                    </div>
                    
                    {/* Alternative Titles Skeleton */}
                    <div className="grid">
                      <Skeleton className="h-6 w-36 mb-2" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                    
                    {/* Badges Skeleton */}
                    <div className="flex flex-wrap sm:gap-2 gap-[2vw]">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                      <Skeleton className="h-8 w-32 rounded-lg" />
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Description Skeleton */}
                  <div className="grid">
                    <div className="space-y-2 p-4 bg-white/10 rounded-lg">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  
                  {/* Action Buttons Skeleton */}
                  <div className="flex sm:flex-row flex-col sm:mt-0 mt-2 sm:w-fit sm:gap-4 gap-[4vw]">
                    <div className="sm:flex grid grid-cols-2 sm:w-fit sm:gap-2 gap-[2vw]">
                      <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
                      <Skeleton className="h-11 w-full sm:w-32 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chapters Section Skeleton */}
              <div className="grid sm:gap-6 gap-[4vw]">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                
                {/* Chapter List Skeleton */}
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer effect overlay */}
      <div className="fixed inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
