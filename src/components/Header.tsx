import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode, TemperatureUnit } from '../types/weather';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  viewMode?: 'standard' | 'station';
  onToggleViewMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  unit,
  onToggleUnit,
  viewMode = 'standard',
  onToggleViewMode,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Sun & Cloud overlapping brand icon as seen in mockup */}
            <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber-400" />
            <svg
              viewBox="0 0 24 24"
              className="relative w-7 h-7 text-sky-500 fill-sky-400"
              fill="currentColor"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Weather Dashboard
          </h1>
        </div>

        {/* Top-Right Controls: View Mode, °C/°F Pill Toggle and Circular Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                viewMode === 'station'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/40'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
              title="Toggle Weather Station Mode"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Weather Station</span>
            </button>
          )}

          {/* Temperature Unit Pill */}
          <div
            className="flex items-center rounded-full p-0.5 bg-blue-600 text-white text-xs font-semibold shadow-xs"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => onToggleUnit('celsius')}
              className={`px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                unit === 'celsius'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-pressed={unit === 'celsius'}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                unit === 'fahrenheit'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-pressed={unit === 'fahrenheit'}
            >
              °F
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-button"
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
