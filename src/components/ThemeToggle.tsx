import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types/weather';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-button"
      type="button"
      onClick={onToggle}
      className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xs"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" aria-hidden="true" />
      )}
    </button>
  );
};
