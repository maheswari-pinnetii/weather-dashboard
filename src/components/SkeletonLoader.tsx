import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      data-testid="current-weather-skeleton"
      className="w-full space-y-4 animate-pulse max-w-7xl mx-auto"
    >
      {/* Search Bar Skeleton */}
      <div className="flex items-center gap-2 max-w-2xl">
        <div className="h-10 flex-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"></div>
        <div className="h-10 w-10 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
      </div>

      {/* Recent Searches Pills Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-slate-200/80 dark:bg-slate-800/80 rounded"></div>
        <div className="h-6 w-16 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"></div>
        <div className="h-6 w-20 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"></div>
        <div className="h-6 w-16 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"></div>
      </div>

      {/* Main 2-Column Grid matching the mockup loading state */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Left Column Skeleton: Current Weather & 5-Day Forecast */}
        <div className="lg:col-span-8 space-y-5">
          {/* Current Weather Card Skeleton */}
          <div className="h-64 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>

            <div className="flex items-center gap-5 my-2">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              <div className="space-y-2">
                <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="h-10 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
              <div className="h-10 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
              <div className="h-10 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl"></div>
            </div>
          </div>

          {/* 5-Day Forecast Skeleton */}
          <div>
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-3 flex flex-col items-center justify-between"
                >
                  <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                  <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton: Weather Details & Recent Searches */}
        <div className="lg:col-span-4 space-y-5">
          <div className="h-56 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-5 space-y-3">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>

          <div className="h-48 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-5 space-y-3">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
