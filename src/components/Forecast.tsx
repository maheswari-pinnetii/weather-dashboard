import React from 'react';
import { DailyForecast, TemperatureUnit } from '../types/weather';
import { ForecastCard } from './ForecastCard';

interface ForecastProps {
  forecast: DailyForecast[];
  unit: TemperatureUnit;
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
}

export const Forecast: React.FC<ForecastProps> = ({
  forecast,
  unit,
  selectedDate,
  onSelectDate,
}) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  // Display only 5-day forecast
  const fiveDayForecast = forecast.slice(0, 5);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>5-Day Forecast</span>
          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
            • Click any day to preview condition
          </span>
        </h3>
        {selectedDate && onSelectDate && (
          <button
            type="button"
            onClick={() => onSelectDate('')}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Reset to Today ↺
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        {fiveDayForecast.map((item) => (
          <ForecastCard
            key={item.date}
            forecast={item}
            unit={unit}
            isSelected={selectedDate === item.date}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
};
