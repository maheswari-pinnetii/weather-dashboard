import React from 'react';
import { Clock } from 'lucide-react';
import { RecentSearchItem } from '../hooks/useRecentSearches';

interface RecentSearchesProps {
  searches: RecentSearchItem[];
  onSelectSearch: (cityName: string) => void;
  disabled?: boolean;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelectSearch,
  disabled = false,
}) => {
  // Default preview cities if user has no recent searches, matching mockup
  const displayCities =
    searches.length > 0
      ? searches.map((s) => s.name)
      : ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

  return (
    <div className="flex items-center gap-2.5 text-xs pt-1 overflow-hidden">
      <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
        Recent Searches
      </span>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {displayCities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onSelectSearch(city)}
            disabled={disabled}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs transition-colors shadow-2xs focus:outline-none cursor-pointer"
          >
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <span>{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
