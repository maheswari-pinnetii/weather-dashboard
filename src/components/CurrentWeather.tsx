import React from 'react';
import { MapPin, Droplets, Wind, ArrowUpDown } from 'lucide-react';
import { CurrentWeatherData, DailyForecast, TemperatureUnit } from '../types/weather';
import { formatTemperature, formatWindSpeed } from '../utils/temperatureUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
  selectedForecastDay?: DailyForecast | null;
  onClearSelectedDay?: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  unit,
  selectedForecastDay,
  onClearSelectedDay,
}) => {
  // If a specific day is selected from the 5-day forecast, display that day's data
  const isForecastPreview = !!selectedForecastDay;

  // Format date: Use selected day's date or today's live date
  let formattedDate: string;
  if (selectedForecastDay) {
    const [y, m, d] = selectedForecastDay.date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    formattedDate = `${selectedForecastDay.dayName}, ${dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })}`;
  } else {
    const localDate = new Date((data.timestamp + data.timezoneOffset) * 1000);
    formattedDate = localDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }

  const activeWeather = selectedForecastDay ? selectedForecastDay.weather : data.weather;
  const activeTemp = selectedForecastDay ? selectedForecastDay.tempMax : data.temperature;
  const activeTempMin = selectedForecastDay ? selectedForecastDay.tempMin : data.tempMin;
  const activeTempMax = selectedForecastDay ? selectedForecastDay.tempMax : data.tempMax;
  const activeHumidity = selectedForecastDay ? selectedForecastDay.avgHumidity : data.humidity;
  const activeWind = selectedForecastDay ? selectedForecastDay.avgWindSpeed : data.windSpeed;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-7 shadow-xs">
      {/* Decorative Cloud Accents with subtle float animation */}
      <div className="absolute -right-6 -top-4 w-48 h-32 pointer-events-none opacity-25 dark:opacity-10 text-sky-400 select-none">
        <svg viewBox="0 0 100 60" fill="currentColor" className="w-full h-full drop-shadow-sm">
          <path d="M20,40 Q10,40 10,30 Q10,20 22,20 Q25,10 38,10 Q50,10 54,18 Q62,15 70,22 Q78,22 80,30 Q82,40 70,40 Z" />
        </svg>
      </div>
      <div className="absolute right-20 bottom-3 w-36 h-24 pointer-events-none opacity-20 dark:opacity-8 text-blue-300 select-none">
        <svg viewBox="0 0 100 60" fill="currentColor" className="w-full h-full">
          <path d="M15,45 Q5,45 5,35 Q5,25 18,25 Q22,12 35,12 Q48,12 52,22 Q60,18 68,26 Q75,26 78,35 Q80,45 68,45 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* City & Country Heading + Return to Live badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {data.cityName}, {data.country}
            </h2>
          </div>
          {isForecastPreview && onClearSelectedDay && (
            <button
              type="button"
              onClick={onClearSelectedDay}
              className="text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-xs"
            >
              Back to Today ↺
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pl-5.5 font-medium">
          {formattedDate} {isForecastPreview && <span className="text-blue-500 font-bold ml-1">• Forecast Preview</span>}
        </p>

        {/* Temperature & Condition Row */}
        <div className="flex items-center gap-5 my-6">
          <WeatherIcon weather={activeWeather} size="lg" />
          <div>
            <div className="flex items-start">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-slate-800 dark:text-white leading-none">
                {formatTemperature(activeTemp, unit, false)}°{unit === 'fahrenheit' ? 'F' : 'C'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              High: {formatTemperature(activeTempMax, unit)} • Low: {formatTemperature(activeTempMin, unit)}
            </p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize mt-0.5">
              {activeWeather.description}
            </p>
          </div>
        </div>

        {/* Sub-Metric 3-Card Pill Row matching the mockup bottom of the card */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
          {/* Humidity */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-2xs">
            <Droplets className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[11px] text-slate-400 font-medium">Humidity</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {activeHumidity}%
              </p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-2xs">
            <Wind className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[11px] text-slate-400 font-medium">Wind Speed</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {formatWindSpeed(activeWind, unit)}
              </p>
            </div>
          </div>

          {/* Min / Max */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-2xs">
            <ArrowUpDown className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[11px] text-slate-400 font-medium">Min / Max</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {formatTemperature(activeTempMin, unit, false)}° / {formatTemperature(activeTempMax, unit, false)}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
