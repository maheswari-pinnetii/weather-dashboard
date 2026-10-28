import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  weather: WeatherCondition;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  useOfficialImage?: boolean;
}

/**
 * WeatherIcon component supporting styled Lucide weather icons as shown in the UI mockup,
 * with optional OpenWeather official PNG images.
 */
export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weather,
  className = '',
  size = 'md',
  useOfficialImage = true,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const iconCode = weather.icon || '01d';
  const isNight = iconCode.endsWith('n');
  const id = weather.id || 800;

  const officialIconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  if (useOfficialImage && !imageError) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <img
          src={officialIconUrl}
          alt={weather.description || 'Weather condition'}
          className="w-full h-full object-contain filter drop-shadow-sm select-none"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  const renderIcon = () => {
    // 2xx Thunderstorm
    if (id >= 200 && id < 300) {
      return <CloudLightning className="w-full h-full text-amber-500 fill-amber-100 dark:fill-amber-950/40" />;
    }
    // 3xx & 5xx Rain
    if (id >= 300 && id < 600) {
      return <CloudRain className="w-full h-full text-blue-500 fill-blue-100 dark:fill-blue-950/40" />;
    }
    // 6xx Snow
    if (id >= 600 && id < 700) {
      return <CloudSnow className="w-full h-full text-sky-400 fill-sky-100 dark:fill-sky-950/40" />;
    }
    // 7xx Atmosphere (Fog, Mist)
    if (id >= 700 && id < 800) {
      return <CloudFog className="w-full h-full text-slate-400 fill-slate-100 dark:fill-slate-800" />;
    }
    // 800 Clear
    if (id === 800) {
      return isNight ? (
        <Moon className="w-full h-full text-amber-300 fill-amber-200/40" />
      ) : (
        <Sun className="w-full h-full text-amber-500 fill-amber-400" />
      );
    }
    // 801, 802 Partly Cloudy
    if (id === 801 || id === 802) {
      return isNight ? (
        <CloudMoon className="w-full h-full text-indigo-400 fill-indigo-100 dark:fill-indigo-950/40" />
      ) : (
        <div className="relative w-full h-full">
          <Sun className="absolute -top-1 -right-1 w-2/3 h-2/3 text-amber-500 fill-amber-400" />
          <Cloud className="absolute bottom-0 left-0 w-3/4 h-3/4 text-sky-400 fill-sky-100 dark:fill-sky-900/50" />
        </div>
      );
    }
    // 803, 804 Overcast
    return <Cloud className="w-full h-full text-slate-400 fill-slate-200 dark:fill-slate-700" />;
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      {renderIcon()}
    </div>
  );
};
