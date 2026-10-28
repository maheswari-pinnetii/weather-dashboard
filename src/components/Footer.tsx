import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md mt-12 py-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>© {currentYear} Weather Dashboard. Built with React, Vite & Tailwind CSS.</p>
        <p className="flex items-center gap-1 text-[11px]">
          <span>Accurate weather insights</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" aria-hidden="true" />
        </p>
      </div>
    </footer>
  );
};
