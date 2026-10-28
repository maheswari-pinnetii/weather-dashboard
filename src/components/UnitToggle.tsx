import React from 'react';
import { TemperatureUnit } from '../types/weather';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onChange }) => {
  return (
    <div
      className="inline-flex items-center rounded-xl p-1 bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 text-xs font-semibold shadow-xs"
      role="group"
      aria-label="Temperature unit selection"
    >
      <button
        id="unit-toggle-celsius"
        type="button"
        onClick={() => onChange('celsius')}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          unit === 'celsius'
            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
        aria-pressed={unit === 'celsius'}
      >
        °C
      </button>
      <button
        id="unit-toggle-fahrenheit"
        type="button"
        onClick={() => onChange('fahrenheit')}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          unit === 'fahrenheit'
            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
        aria-pressed={unit === 'fahrenheit'}
      >
        °F
      </button>
    </div>
  );
};
