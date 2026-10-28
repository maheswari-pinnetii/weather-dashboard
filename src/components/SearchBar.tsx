import React, { useState } from 'react';
import { Search, Navigation, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
  isLocationLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onUseCurrentLocation,
  isLoading,
  isLocationLoading = false,
}) => {
  const [cityInput, setCityInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cityInput.trim();

    if (!trimmed) {
      setValidationError('Please enter a city name.');
      return;
    }

    setValidationError(null);
    onSearch(trimmed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2.5 max-w-3xl"
      >
        {/* Main Search Input Capsule */}
        <div className="relative flex-1">
          <label htmlFor="city-search-input" className="sr-only">
            Search for a city...
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="city-search-input"
            type="text"
            value={cityInput}
            onChange={handleChange}
            placeholder="Search for a city..."
            disabled={isLoading || isLocationLoading}
            className="w-full pl-9.5 pr-36 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />

          {/* Embedded "Use My Location" Pill Button */}
          <div className="absolute inset-y-1 right-1 flex items-center">
            <button
              id="location-detect-button"
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLoading || isLocationLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs disabled:opacity-60"
              title="Use current location"
              aria-label="Use current location"
            >
              {isLocationLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" aria-hidden="true" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
              )}
              <span>Use My Location</span>
            </button>
          </div>
        </div>

        {/* Square Blue Search Submit Button */}
        <button
          id="search-submit-button"
          type="submit"
          disabled={isLoading || isLocationLoading}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition-colors shrink-0 disabled:opacity-60"
          title="Search"
          aria-label="Search"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </form>

      {validationError && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium pl-3">
          {validationError}
        </p>
      )}
    </div>
  );
};
