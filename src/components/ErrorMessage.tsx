import React from 'react';
import { AlertCircle, RefreshCw, KeyRound, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  code?: string | null;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  code,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="w-full max-w-xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-8 text-center shadow-xs flex flex-col items-center justify-center my-6"
    >
      {/* Prominent Red Circular Alert Badge as depicted in Error State mockup */}
      <div className="w-14 h-14 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-2xs">
        {code === 'MISSING_API_KEY' ? (
          <KeyRound className="w-7 h-7 text-red-500" aria-hidden="true" />
        ) : code === 'NETWORK_ERROR' ? (
          <WifiOff className="w-7 h-7 text-red-500" aria-hidden="true" />
        ) : (
          <AlertCircle className="w-7 h-7 text-red-500 fill-red-100 dark:fill-red-950/40" aria-hidden="true" />
        )}
      </div>

      <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
        Failed to fetch weather data
      </h4>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
        {message || "We couldn't find weather information. Please check the city name and try again."}
      </p>

      {code === 'MISSING_API_KEY' && (
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono text-left w-full">
          Add to <code className="font-bold text-blue-600">.env</code>:
          <br />
          <span>VITE_OPENWEATHER_API_KEY=your_key_here</span>
        </div>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
