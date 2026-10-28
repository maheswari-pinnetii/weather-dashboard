import React from 'react';
import { Users, ArrowUpRight } from 'lucide-react';

interface EmptyStateProps {
  onSuggestedCity: (city: string) => void;
  disabled?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSuggestedCity,
  disabled = false,
}) => {
  const suggestions = [
    { name: 'London', desc: 'United Kingdom' },
    { name: 'Tokyo', desc: 'Japan' },
    { name: 'New York', desc: 'United States' },
    { name: 'Sydney', desc: 'Australia' },
  ];

  return (
    <div className="w-full text-center py-12 px-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <Users className="w-8 h-8" aria-hidden="true" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        Explore Global Weather
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Search for any city worldwide, or use your current location to view live temperature, detailed metrics, and five-day forecast summaries.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Popular cities:
        </span>
        {suggestions.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => onSuggestedCity(city.name)}
            disabled={disabled}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-2xs group focus:outline-none"
          >
            <span>{city.name}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
};
