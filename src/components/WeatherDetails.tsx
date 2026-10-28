import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Clock,
  X,
} from 'lucide-react';
import { CurrentWeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature, formatWindSpeed } from '../utils/temperatureUtils';
import { RecentSearchItem } from '../hooks/useRecentSearches';

interface WeatherDetailsProps {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
  recentSearches: RecentSearchItem[];
  onSelectSearch: (cityName: string) => void;
  onRemoveSearch: (id: string) => void;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  data,
  unit,
  recentSearches,
  onSelectSearch,
  onRemoveSearch,
}) => {
  // Mockup fallback list if empty
  const defaultRecent = [
    { id: '1', name: 'London' },
    { id: '2', name: 'New York' },
    { id: '3', name: 'Tokyo' },
    { id: '4', name: 'Paris' },
    { id: '5', name: 'Sydney' },
  ];

  const searchList =
    recentSearches.length > 0
      ? recentSearches.map((s) => ({ id: s.id, name: s.name }))
      : defaultRecent;

  return (
    <div className="flex flex-col gap-5">
      {/* Weather Details Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">
          Weather Details
        </h3>

        <div className="space-y-3.5 text-xs">
          {/* Humidity */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-medium">
              <Droplets className="w-4 h-4 text-blue-500" aria-hidden="true" />
              Humidity
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {data.humidity}%
            </span>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-medium">
              <Wind className="w-4 h-4 text-sky-400" aria-hidden="true" />
              Wind Speed
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formatWindSpeed(data.windSpeed, unit)}
            </span>
          </div>

          {/* Pressure */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-medium">
              <Gauge className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              Pressure
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {data.pressure} hPa
            </span>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-medium">
              <Eye className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Visibility
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {(data.visibility / 1000).toFixed(0)} km
            </span>
          </div>

          {/* UV Index (Estimated / Representative indicator) */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-medium">
              <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
              UV Index
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              4 (Moderate)
            </span>
          </div>
        </div>
      </div>

      {/* Right Column Recent Searches List */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">
          Recent Searches
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {searchList.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between group"
            >
              <button
                type="button"
                onClick={() => onSelectSearch(item.name)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                </div>
                <span>{item.name}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemoveSearch(item.id)}
                className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
