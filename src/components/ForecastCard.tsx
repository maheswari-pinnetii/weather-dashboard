import React from 'react';
import { DailyForecast, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/temperatureUtils';
import { WeatherIcon } from './WeatherIcon';

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
  isSelected?: boolean;
  onSelect?: (date: string) => void;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  forecast,
  unit,
  isSelected = false,
  onSelect,
}) => {
  // Format short date: "Apr 29"
  const [y, m, d] = forecast.date.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <button
      type="button"
      onClick={() => onSelect?.(forecast.date)}
      className={`relative z-10 flex flex-col items-center justify-between px-2 py-3 sm:px-3 sm:py-3.5 rounded-2xl border text-center transition-all cursor-pointer pointer-events-auto w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        isSelected
          ? 'bg-blue-600/15 dark:bg-blue-500/25 border-blue-500 shadow-md ring-2 ring-blue-500/50 scale-[1.03]'
          : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
      }`}
      title={`Click to preview weather for ${forecast.dayName}`}
      aria-pressed={isSelected}
    >
      {/* Day and Date */}
      <div>
        <p className="font-bold text-xs text-slate-800 dark:text-slate-100">
          {forecast.dayName}
        </p>
        <p className="text-[10px] text-slate-400 font-medium">
          {formattedDate}
        </p>
      </div>

      {/* Weather Icon */}
      <div className="my-2.5">
        <WeatherIcon weather={forecast.weather} size="md" />
      </div>

      {/* Min / Max Temperature Range */}
      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
        {formatTemperature(forecast.tempMax, unit, false)}° / {formatTemperature(forecast.tempMin, unit, false)}°
      </div>

      {/* Condition Description */}
      <p className="text-[10px] font-medium text-slate-400 capitalize mt-0.5 line-clamp-1">
        {forecast.weather.description}
      </p>
    </button>
  );
};
