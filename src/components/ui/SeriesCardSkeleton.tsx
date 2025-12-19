import { Skeleton } from "@/components/ui/skeleton";

export default function SeriesCardSkeleton() {
  return (
    <div
      className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md rounded-2xl border border-border/40 p-0 relative overflow-hidden"
      style={{ aspectRatio: '4.5 / 2.5' }}
    >
      <div className="flex h-full">
        {/* Cover Image Skeleton - Left Side */}
        <div className="relative flex-shrink-0" style={{ width: '42%' }}>
          <Skeleton className="w-full h-full rounded-none" />
          
          {/* Genre Badge Skeleton */}
          <div className="absolute top-2 left-2">
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
          
          {/* Bookmark Icon Skeleton */}
          <div className="absolute bottom-2 left-2">
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
        </div>

        {/* Content Skeleton - Right Side */}
        <div className="flex flex-col min-w-0 p-2 sm:p-3 lg:p-4" style={{ width: '58%' }}>
          {/* Title Skeleton */}
          <div className="mb-2 sm:mb-3 flex-shrink-0">
            <Skeleton className="h-4 sm:h-5 w-full mb-1" />
            <Skeleton className="h-4 sm:h-5 w-3/4" />
          </div>
          
          {/* Chapter List Skeleton */}
          <div className="space-y-1 flex-1">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </div>

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
