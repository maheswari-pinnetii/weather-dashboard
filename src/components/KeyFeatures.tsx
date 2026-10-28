import React from 'react';
import {
  Search,
  Sun,
  CalendarDays,
  Thermometer,
  Clock,
  Navigation,
  Moon,
  Loader2,
  Smartphone,
} from 'lucide-react';

export const KeyFeatures: React.FC = () => {
  const features = [
    { label: 'City Search', icon: <Search className="w-5 h-5 text-blue-500" /> },
    { label: 'Current Weather', icon: <Sun className="w-5 h-5 text-amber-500" /> },
    { label: '5-Day Forecast', icon: <CalendarDays className="w-5 h-5 text-blue-600" /> },
    { label: 'Temperature Toggle', icon: <Thermometer className="w-5 h-5 text-teal-500" /> },
    { label: 'Recent Searches', icon: <Clock className="w-5 h-5 text-indigo-500" /> },
    { label: 'Auto Geolocation', icon: <Navigation className="w-5 h-5 text-blue-500" /> },
    { label: 'Dark / Light Mode', icon: <Moon className="w-5 h-5 text-indigo-400" /> },
    { label: 'Human-Centered UX', icon: <Loader2 className="w-5 h-5 text-purple-500" /> },
    { label: 'Fully Responsive', icon: <Smartphone className="w-5 h-5 text-sky-500" /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h3 className="text-center font-bold text-base text-slate-800 dark:text-slate-100 mb-6">
        Key Features
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {features.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 text-center shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2.5">
              {item.icon}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 text-xs italic text-slate-400 font-serif">
        ~ Stay ahead of the weather 🌤️ ~
      </div>
    </div>
  );
};
