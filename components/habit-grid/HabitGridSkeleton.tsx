import React from "react";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-gray-200 dark:bg-neutral-700 rounded animate-pulse ${className}`}
  />
);

export function HabitGridSkeleton() {
  const datesOfWeekPlaceholders = Array(7).fill(0);
  const habitRowsPlaceholders = Array(3).fill(0);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
      <div className="grid grid-cols-8 gap-x-2 gap-y-4 items-center text-center">
        <div className="font-semibold text-left sticky top-0 bg-white dark:bg-neutral-900 py-2 pl-2">
          <SkeletonBox className="h-5 w-20" />
        </div>
        {datesOfWeekPlaceholders.map((_, index) => (
          <div
            key={`header-skel-${index}`}
            className="font-semibold text-xs sm:text-sm sticky top-0 bg-white dark:bg-neutral-900 py-2 flex justify-center"
          >
            <SkeletonBox className="h-5 w-12" />
          </div>
        ))}
        {habitRowsPlaceholders.map((_, rowIndex) => (
          <React.Fragment key={`row-skel-${rowIndex}`}>
            <div className="text-left py-2 pl-2">
              <SkeletonBox className="h-5 w-3/4" />
            </div>
            {datesOfWeekPlaceholders.map((_, colIndex) => (
              <div
                key={`cell-skel-${rowIndex}-${colIndex}`}
                className="flex justify-center items-center py-2"
              >
                <SkeletonBox className="w-5 h-5 rounded" />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
