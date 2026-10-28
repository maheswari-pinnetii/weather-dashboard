import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  MapPin,
  Clock,
  Compass,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Camera,
  Activity,
  Trees,
  Home,
  CheckCircle2,
  Sliders,
  Image as ImageIcon,
  SunMedium,
  Calendar,
  CalendarDays,
  Download,
  ExternalLink,
  X,
  Play,
  Pause,
  Maximize2,
  Sparkles,
  Mountain,
} from 'lucide-react';
import { CurrentWeatherData, DailyForecast, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/temperatureUtils';
import {
  getMondayToSundayWeek,
  downloadCalendarIcs,
  getGoogleCalendarUrl,
} from '../utils/calendarUtils';
import { WeatherIcon } from './WeatherIcon';
import { RecentSearchItem } from '../hooks/useRecentSearches';
import { fetchLocationPhoto } from '../services/unsplashService';

interface WeatherStationProps {
  current: CurrentWeatherData;
  forecast: DailyForecast[];
  unit: TemperatureUnit;
  onCityChange?: (cityName: string) => void;
  onToggleUnit?: (unit: TemperatureUnit) => void;
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
  recentSearches?: RecentSearchItem[];
  onSelectSearch?: (cityName: string) => void;
}

export const WeatherStation: React.FC<WeatherStationProps> = ({
  current,
  forecast,
  unit,
  onCityChange,
  onToggleUnit,
  selectedDate,
  onSelectDate,
  recentSearches = [],
  onSelectSearch,
}) => {
  // Live local time
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  const [activeTab, setActiveTab] = useState<'weather' | 'calendar' | 'photoFrame' | 'settings' | 'brightness'>('weather');

  // Ambient Nature Landscapes in Display Mode State
  const [currentLandscapeIndex, setCurrentLandscapeIndex] = useState(0);
  const [isLandscapePlaying, setIsLandscapePlaying] = useState(true);
  const [isLandscapeFullscreen, setIsLandscapeFullscreen] = useState(false);
  const [locationPhotoUrl, setLocationPhotoUrl] = useState<string | null>(null);

  // Automatically reset to real-time searched location landscape when city changes & fetch Unsplash photo
  useEffect(() => {
    setCurrentLandscapeIndex(0);
    let isMounted = true;
    if (current.cityName) {
      fetchLocationPhoto(current.cityName).then((url) => {
        if (isMounted) {
          setLocationPhotoUrl(url);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [current.cityName]);

  // Modals & Popups
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [brightness, setBrightness] = useState<number>(85);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);

  // Ref and helper to scroll recent searches smoothly
  const recentSearchesScrollRef = useRef<HTMLDivElement>(null);

  const scrollRecentSearches = (direction: 'left' | 'right') => {
    if (recentSearchesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      recentSearchesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Real-Time Nature Landscape Generator dynamically tailored to the searched location & climate
  const generateLocationNatureLandscape = () => {
    const cityName = current.cityName || 'Current City';
    const country = current.country || '';
    const locationLabel = country ? `${cityName}, ${country}` : cityName;
    const condMain = (current.weather?.main || '').toLowerCase();
    const condDesc = current.weather?.description || 'Clear Sky';
    const temp = current.temperature;

    // Determine day / twilight / night phase based on destination local hour
    const nowUtc = Date.now();
    const targetDate = new Date(nowUtc + (current.timezoneOffset || 0) * 1000);
    const hour = targetDate.getUTCHours();
    const isNight = hour < 6 || hour >= 21;
    const isSunset = (hour >= 18 && hour < 21) || (hour >= 5 && hour < 7);
    const isDay = !isNight && !isSunset;

    const timeOfDayLabel = isNight
      ? 'Starlit Night Horizon'
      : isSunset
      ? 'Golden Twilight Vista'
      : 'Midday Natural Light';

    // Tailor landscape theme to the atmospheric condition & geography
    if (condMain.includes('thunder') || condMain.includes('storm')) {
      return {
        id: `thunder-${cityName.toLowerCase()}`,
        title: `${cityName} Tempest & Wilderness Ridge`,
        location: `${locationLabel} • Thunderstorm Dynamic`,
        timeOfDay: timeOfDayLabel,
        description: `Electric atmospheric energy illuminating high mountain peaks and ancient wilderness around ${cityName} at ${formatTemperature(temp, unit)}.`,
        accent: 'from-purple-900/40 via-indigo-950/50 to-slate-950',
        tag: 'Electric Stormscape',
        gradientBg: 'linear-gradient(135deg, #09090b 0%, #3b0764 50%, #020617 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='tsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e1b4b'/%3E%3Cstop offset='60%25' stop-color='%233b0764'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23tsky)'/%3E%3Cpolyline points='700,40 660,180 720,200 640,360' stroke='%23c084fc' stroke-width='4' fill='none' filter='drop-shadow(0 0 8px %23a855f7)'/%3E%3Cpolygon points='0,675 220,340 540,675' fill='%2309090b'/%3E%3Cpolygon points='380,675 720,260 1080,675' fill='%2318181b' opacity='0.9'/%3E%3Cpolygon points='850,675 1060,380 1200,675' fill='%2309090b'/%3E%3Crect y='530' width='1200' height='145' fill='%23020617'/%3E%3C/svg%3E")`,
      };
    }

    if (condMain.includes('fog') || condMain.includes('mist') || condMain.includes('haze')) {
      return {
        id: `mist-${cityName.toLowerCase()}`,
        title: `${cityName} Mystic Cedar Valley`,
        location: `${locationLabel} • Morning Fog`,
        timeOfDay: timeOfDayLabel,
        description: `Serene ambient mist settling between ancient cedar groves and quiet waterways across ${cityName}.`,
        accent: 'from-teal-800/25 via-slate-800/35 to-slate-950',
        tag: 'Ethereal Mist',
        gradientBg: 'linear-gradient(135deg, #134e4a 0%, #334155 50%, #020617 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='fmsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23134e4a'/%3E%3Cstop offset='60%25' stop-color='%2394a3b8'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23fmsky)'/%3E%3Cellipse cx='600' cy='320' rx='500' ry='70' fill='%23cbd5e1' opacity='0.45'/%3E%3Cpolygon points='0,675 180,360 420,675' fill='%23042f2e' opacity='0.85'/%3E%3Cpolygon points='300,675 580,290 860,675' fill='%230f172a' opacity='0.9'/%3E%3Cpolygon points='720,675 960,340 1200,675' fill='%23042f2e' opacity='0.85'/%3E%3Crect y='510' width='1200' height='165' fill='%23020617' opacity='0.95'/%3E%3C/svg%3E")`,
      };
    }

    if (condMain.includes('rain') || condMain.includes('drizzle')) {
      return {
        id: `rain-${cityName.toLowerCase()}`,
        title: `${cityName} Rainfall Panorama`,
        location: `${locationLabel} • Live Precipitation`,
        timeOfDay: timeOfDayLabel,
        description: `Atmospheric rains cascading over misty ${cityName} nature reserves, replenishing emerald foliage at ${formatTemperature(temp, unit)}.`,
        accent: 'from-blue-600/30 via-slate-800/40 to-slate-950',
        tag: 'Live Rainfall',
        gradientBg: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #020617 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='rsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e293b'/%3E%3Cstop offset='70%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3Cpattern id='rain' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cline x1='0' y1='0' x2='10' y2='20' stroke='%2338bdf8' stroke-width='1.5' opacity='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23rsky)'/%3E%3Crect width='1200' height='675' fill='url(%23rain)'/%3E%3Cpolygon points='0,500 280,320 600,530' fill='%231e293b' opacity='0.8'/%3E%3Cpolygon points='340,530 680,260 1020,550' fill='%230f172a' opacity='0.9'/%3E%3Cpolygon points='680,550 940,340 1200,560' fill='%23020617'/%3E%3Cpath d='M0,520 Q300,500 600,520 T1200,510 L1200,675 L0,675 Z' fill='%230284c7' opacity='0.3'/%3E%3Crect y='540' width='1200' height='135' fill='%23020617' opacity='0.95'/%3E%3C/svg%3E")`,
      };
    }

    if (condMain.includes('snow') || temp <= 2) {
      return {
        id: `snow-${cityName.toLowerCase()}`,
        title: `${cityName} Frost & Snow Peaks`,
        location: `${locationLabel} • Alpine Winter`,
        timeOfDay: timeOfDayLabel,
        description: `Crisp sub-zero powdered snow enveloping evergreen valleys and ridges across ${cityName} under ${condDesc.toLowerCase()}.`,
        accent: 'from-sky-300/20 via-blue-900/30 to-slate-950',
        tag: 'Winter Snowscape',
        gradientBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='ssky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2338bdf8'/%3E%3Cstop offset='60%25' stop-color='%23e0f2fe'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23ssky)'/%3E%3Cpolygon points='0,450 320,180 640,480' fill='%23bae6fd' opacity='0.9'/%3E%3Cpolygon points='280,480 620,120 960,510' fill='%23e0f2fe' opacity='0.95'/%3E%3Cpolygon points='580,510 880,200 1200,530' fill='%237dd3fc' opacity='0.9'/%3E%3Cpolygon points='620,120 660,180 580,180' fill='%23fff'/%3E%3Cpolygon points='320,180 350,230 290,230' fill='%23fff'/%3E%3Cpolygon points='880,200 910,250 850,250' fill='%23fff'/%3E%3Crect y='480' width='1200' height='195' fill='%23f0f9ff' opacity='0.95'/%3E%3C/svg%3E")`,
      };
    }

    if (condMain.includes('cloud')) {
      return {
        id: `clouds-${cityName.toLowerCase()}`,
        title: `${cityName} Cloud Forest & Valley`,
        location: `${locationLabel} • ${condDesc}`,
        timeOfDay: timeOfDayLabel,
        description: `Rolling cloud waves sweeping across high-altitude plateaus and natural horizons surrounding ${cityName}.`,
        accent: 'from-slate-400/20 via-sky-800/30 to-slate-950',
        tag: 'Cloud Horizon',
        gradientBg: 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='csky2' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2364748b'/%3E%3Cstop offset='65%25' stop-color='%2394a3b8'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23csky2)'/%3E%3Ccircle cx='300' cy='250' r='100' fill='%23cbd5e1' opacity='0.6'/%3E%3Ccircle cx='420' cy='220' r='120' fill='%23e2e8f0' opacity='0.7'/%3E%3Ccircle cx='560' cy='240' r='90' fill='%23cbd5e1' opacity='0.6'/%3E%3Cpolygon points='0,675 160,380 400,675' fill='%231e293b' opacity='0.85'/%3E%3Cpolygon points='300,675 520,320 780,675' fill='%230f172a' opacity='0.9'/%3E%3Cpolygon points='650,675 880,360 1150,675' fill='%23020617' opacity='0.95'/%3E%3Crect y='530' width='1200' height='145' fill='%230f172a'/%3E%3C/svg%3E")`,
      };
    }

    if (isSunset) {
      return {
        id: `sunset-${cityName.toLowerCase()}`,
        title: `${cityName} Golden Twilight Ridge`,
        location: `${locationLabel} • Sunset Vista`,
        timeOfDay: timeOfDayLabel,
        description: `Amber and amber-gold twilight rays bathing the nature reserves of ${cityName} in breathtaking ambient tranquility.`,
        accent: 'from-amber-500/25 via-rose-700/35 to-slate-950',
        tag: 'Golden Twilight',
        gradientBg: 'linear-gradient(135deg, #1e1b4b 0%, #7c2d12 40%, #0c0a09 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='gsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%234c0519'/%3E%3Cstop offset='45%25' stop-color='%23ea580c'/%3E%3Cstop offset='75%25' stop-color='%23fef08a'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3CradialGradient id='gsun' cx='50%25' cy='60%25' r='20%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.95'/%3E%3Cstop offset='100%25' stop-color='%23f97316' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23gsky)'/%3E%3Ccircle cx='600' cy='390' r='180' fill='url(%23gsun)'/%3E%3Cpolygon points='0,675 0,380 350,560 300,675' fill='%231c1917'/%3E%3Cpolygon points='1200,675 1200,320 850,550 920,675' fill='%230c0a09'/%3E%3Cpolygon points='250,580 600,360 950,570' fill='%23292524' opacity='0.8'/%3E%3Crect y='510' width='1200' height='165' fill='%230c0a09'/%3E%3C/svg%3E")`,
      };
    }

    if (isNight) {
      return {
        id: `night-${cityName.toLowerCase()}`,
        title: `${cityName} Starlit Alpine Reserve`,
        location: `${locationLabel} • Night Sky`,
        timeOfDay: timeOfDayLabel,
        description: `Crystal clear midnight canopy over the peaceful valleys of ${cityName} under twinkling stars and silent horizons.`,
        accent: 'from-indigo-600/20 via-blue-950/40 to-slate-950',
        tag: 'Starlit Horizon',
        gradientBg: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
        svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='nsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23020617'/%3E%3Cstop offset='70%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23nsky)'/%3E%3Ccircle cx='950' cy='160' r='55' fill='%23fef08a'/%3E%3Ccircle cx='970' cy='150' r='50' fill='%23020617'/%3E%3Ccircle cx='200' cy='120' r='2' fill='%23fff' opacity='0.8'/%3E%3Ccircle cx='350' cy='80' r='2.5' fill='%23fff' opacity='0.9'/%3E%3Ccircle cx='500' cy='150' r='1.5' fill='%23fff' opacity='0.7'/%3E%3Ccircle cx='700' cy='100' r='2' fill='%23fff' opacity='0.8'/%3E%3Cpolygon points='0,675 250,380 550,675' fill='%23020617'/%3E%3Cpolygon points='400,675 750,300 1100,675' fill='%230f172a' opacity='0.9'/%3E%3Cpolygon points='900,675 1100,420 1200,675' fill='%23020617'/%3E%3C/svg%3E")`,
      };
    }

    // Default sunny / clear daytime panorama for the searched city
    return {
      id: `sunny-${cityName.toLowerCase()}`,
      title: `${cityName} Sunlit Alpine Panorama`,
      location: `${locationLabel} • Natural Horizon`,
      timeOfDay: timeOfDayLabel,
      description: `Lush sun-drenched mountain slopes and crystal clear ambient calm embracing ${cityName} at a pleasant ${formatTemperature(temp, unit)}.`,
      accent: 'from-amber-400/20 via-sky-500/30 to-slate-950',
      tag: 'Sunlit Vista',
      gradientBg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 45%, #0f172a 100%)',
      svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='dsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230284c7'/%3E%3Cstop offset='65%25' stop-color='%23bae6fd'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23dsky)'/%3E%3Ccircle cx='800' cy='220' r='85' fill='%23fef08a' opacity='0.9'/%3E%3Cpolygon points='0,675 0,340 380,560' fill='%230f172a'/%3E%3Cpolygon points='1200,675 1200,280 820,540' fill='%23020617'/%3E%3Cpolygon points='280,560 620,320 960,560' fill='%230369a1' opacity='0.8'/%3E%3Crect y='520' width='1200' height='155' fill='%230284c7' opacity='0.6'/%3E%3C/svg%3E")`,
    };
  };

  // Real-time location-based landscape dynamically inserted as lead card with Unsplash photo if loaded
  const baseRealtimeLandscape = generateLocationNatureLandscape();
  const realtimeLocationLandscape = {
    ...baseRealtimeLandscape,
    svgArt: locationPhotoUrl ? `url("${locationPhotoUrl}")` : baseRealtimeLandscape.svgArt,
  };

  // Curated Nature Landscapes in Display Mode with Real-Time Searched Location featured first
  const natureLandscapes = [
    realtimeLocationLandscape,
    {
      id: 'alpine-sunset',
      title: 'Alpine Peak Sunset',
      location: 'Swiss Alps • 3,200m',
      timeOfDay: 'Golden Hour Sunset',
      description: 'Luminous crimson rays cast over snow-dusted ridges with crystal clear ambient calm.',
      accent: 'from-amber-500/20 via-orange-600/30 to-slate-950',
      tag: 'Mountain Panorama',
      gradientBg: 'linear-gradient(135deg, #1e1b4b 0%, #7c2d12 40%, #0c0a09 100%)',
      svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e1b4b'/%3E%3Cstop offset='50%25' stop-color='%23f97316'/%3E%3Cstop offset='80%25' stop-color='%23ea580c'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3CradialGradient id='sun' cx='50%25' cy='55%25' r='25%25'%3E%3Cstop offset='0%25' stop-color='%23fef08a' stop-opacity='0.9'/%3E%3Cstop offset='100%25' stop-color='%23ea580c' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23sky)'/%3E%3Ccircle cx='600' cy='360' r='180' fill='url(%23sun)'/%3E%3Cpolygon points='0,450 320,240 640,480' fill='%23312e81' opacity='0.7'/%3E%3Cpolygon points='280,480 620,180 960,510' fill='%231e1b4b' opacity='0.85'/%3E%3Cpolygon points='580,510 880,260 1200,530' fill='%230f172a' opacity='0.9'/%3E%3Cpolygon points='620,180 660,250 580,250' fill='%23fff' opacity='0.8'/%3E%3Cpolygon points='320,240 350,290 290,290' fill='%23fff' opacity='0.7'/%3E%3Cpolygon points='880,260 910,310 850,310' fill='%23fff' opacity='0.75'/%3E%3Crect y='500' width='1200' height='175' fill='%23020617'/%3E%3Cpath d='M0,520 Q300,500 600,520 T1200,510 L1200,675 L0,675 Z' fill='%23020617' opacity='0.95'/%3E%3C/svg%3E")`,
    },
    {
      id: 'nordic-fjord',
      title: 'Misty Nordic Fjord',
      location: 'Geirangerfjord • Norway',
      timeOfDay: 'Morning Mist & Still Water',
      description: 'Glass-smooth fjord waters reflecting sheer granite cliffs enveloped in cool ambient cedar mist.',
      accent: 'from-emerald-600/20 via-teal-700/30 to-slate-950',
      tag: 'Emerald Waters',
      gradientBg: 'linear-gradient(135deg, #042f2e 0%, #0f766e 40%, #020617 100%)',
      svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='fjordsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23134e4a'/%3E%3Cstop offset='60%25' stop-color='%235eead4'/%3E%3Cstop offset='100%25' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23fjordsky)'/%3E%3Cpolygon points='0,675 0,160 380,480 300,675' fill='%230f172a'/%3E%3Cpolygon points='1200,675 1200,120 780,470 880,675' fill='%23020617'/%3E%3Cpolygon points='380,480 600,320 780,470' fill='%23134e4a' opacity='0.6'/%3E%3Crect y='470' width='1200' height='205' fill='%23042f2e' opacity='0.95'/%3E%3Cellipse cx='600' cy='560' rx='450' ry='15' fill='%232dd4bf' opacity='0.25'/%3E%3Ccircle cx='300' cy='300' r='18' fill='%23065f46'/%3E%3C/svg%3E")`,
    },
    {
      id: 'pacific-coast',
      title: 'Pacific Redwood Coast',
      location: 'Big Sur • California',
      timeOfDay: 'Ocean Twilight & Marine Layer',
      description: 'Towering evergreen coastal forests meeting rolling azure swells with peaceful ocean mist.',
      accent: 'from-blue-600/20 via-indigo-700/30 to-slate-950',
      tag: 'Coastal Waves',
      gradientBg: 'linear-gradient(135deg, #172554 0%, #1d4ed8 45%, #020617 100%)',
      svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='csky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230284c7'/%3E%3Cstop offset='50%25' stop-color='%23f472b6'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23csky)'/%3E%3Cpath d='M0,450 Q300,430 600,450 T1200,450 L1200,675 L0,675 Z' fill='%230369a1' opacity='0.8'/%3E%3Cpath d='M0,520 Q300,500 600,520 T1200,520 L1200,675 L0,675 Z' fill='%23075985'/%3E%3Cpolygon points='0,675 0,380 250,560' fill='%23020617'/%3E%3Cpolygon points='1200,675 1200,320 880,590' fill='%23020617'/%3E%3C/svg%3E")`,
    },
    {
      id: 'autumn-forest',
      title: 'Kyoto Autumn Canopy',
      location: 'Arashiyama • Japan',
      timeOfDay: 'Zen Bamboo & Maple Foliage',
      description: 'Amber and scarlet foliage framing stone pathways in serene ambient harmony.',
      accent: 'from-rose-600/20 via-amber-600/30 to-slate-950',
      tag: 'Autumn Solitude',
      gradientBg: 'linear-gradient(135deg, #450a0a 0%, #b45309 45%, #0c0a09 100%)',
      svgArt: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='fsky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%237f1d1d'/%3E%3Cstop offset='55%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23fsky)'/%3E%3Ccircle cx='850' cy='280' r='120' fill='%23fef08a' opacity='0.7'/%3E%3Cpolygon points='150,675 220,380 290,675' fill='%23991b1b' opacity='0.85'/%3E%3Cpolygon points='320,675 420,320 520,675' fill='%23b45309' opacity='0.9'/%3E%3Cpolygon points='650,675 750,350 850,675' fill='%23dc2626' opacity='0.85'/%3E%3Cpolygon points='920,675 1020,400 1120,675' fill='%2378350f' opacity='0.95'/%3E%3Crect y='580' width='1200' height='95' fill='%231c1917'/%3E%3C/svg%3E")`,
    },
  ];

  // Auto-advance landscape slideshow every 6 seconds when playing in photoFrame mode
  useEffect(() => {
    if (activeTab !== 'photoFrame' || !isLandscapePlaying) return;

    const interval = setInterval(() => {
      setCurrentLandscapeIndex((prev) => (prev + 1) % natureLandscapes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeTab, isLandscapePlaying, natureLandscapes.length]);

  // Format live local time and date for the searched city location using its timezone offset
  useEffect(() => {
    const updateTime = () => {
      const nowUtc = Date.now();
      // Shift epoch by the searched city's timezone offset (in seconds)
      const targetEpoch = nowUtc + (current.timezoneOffset || 0) * 1000;
      const targetDate = new Date(targetEpoch);

      // UTC methods on shifted epoch give exact destination local time
      const hours = String(targetDate.getUTCHours()).padStart(2, '0');
      const minutes = String(targetDate.getUTCMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
      const day = targetDate.getUTCDate();
      const month = targetDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
      const year = targetDate.getUTCFullYear();
      setDateStr(`${weekday}\n${month} ${day}, ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [current.timezoneOffset, current.cityName]);

  // Find selected forecast day if any
  const activeForecastDay = forecast.find((f) => f.date === selectedDate) || null;

  // Formatted date string for selected forecast day vs live today
  let activeDateStr = dateStr;
  if (activeForecastDay) {
    const [y, m, d] = activeForecastDay.date.split('-').map(Number);
    const dayDate = new Date(Date.UTC(y, m - 1, d));
    const fullWeekday = dayDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    const fullMonth = dayDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
    const fullDayNum = dayDate.getUTCDate();
    const fullYear = dayDate.getUTCFullYear();
    activeDateStr = `${fullWeekday}\n${fullMonth} ${fullDayNum}, ${fullYear}`;
  }

  // Active weather condition and values (switching to selected day if clicked)
  const displayWeather = activeForecastDay ? activeForecastDay.weather : current.weather;
  const displayTemp = activeForecastDay ? activeForecastDay.tempMax : current.temperature;
  const displayTempMin = activeForecastDay ? activeForecastDay.tempMin : current.tempMin;
  const displayTempMax = activeForecastDay ? activeForecastDay.tempMax : current.tempMax;
  const displayHumidity = activeForecastDay ? activeForecastDay.avgHumidity : current.humidity;
  const displayWind = activeForecastDay ? activeForecastDay.avgWindSpeed : current.windSpeed;

  // Day-specific outdoor garden & indoor sensor temperatures and stats derived from searched city
  const outdoorTemp = activeForecastDay ? activeForecastDay.tempMax : current.temperature;
  const indoorOfficeTemp = activeForecastDay ? activeForecastDay.tempMax + 0.8 : current.temperature + 1.2;
  const indoorLivingTemp = activeForecastDay ? activeForecastDay.tempMax + 0.4 : current.temperature + 0.6;
  const displayAirQuality = displayHumidity > 75 ? 'Moderate' : 'Very Good';

  // Sunrise & Sunset formatted specifically for the searched city location
  const sunriseEpoch = (current.timestamp - 7200 + (current.timezoneOffset || 0)) * 1000;
  const sunsetEpoch = (current.timestamp + 25200 + (current.timezoneOffset || 0)) * 1000;
  const sunriseDate = new Date(sunriseEpoch);
  const sunsetDate = new Date(sunsetEpoch);
  const sunriseStr = `${String(sunriseDate.getUTCHours()).padStart(2, '0')}:${String(sunriseDate.getUTCMinutes()).padStart(2, '0')}`;
  const sunsetStr = `${String(sunsetDate.getUTCHours()).padStart(2, '0')}:${String(sunsetDate.getUTCMinutes()).padStart(2, '0')}`;

  // Calculate Monday to Sunday calendar week with weather forecast mapping
  const currentWeekDays = getMondayToSundayWeek(new Date(current.timestamp * 1000));
  const weekWithWeather = currentWeekDays.map((cDay) => {
    // Find forecast matching this calendar date or day name
    const match = forecast.find((f) => f.date === cDay.dateKey || f.dayName.toLowerCase() === cDay.dayName.toLowerCase());
    return {
      ...cDay,
      forecast: match,
    };
  });

  // Hourly steps derived from forecast for the hourly timeline
  const hourlySteps = [
    { time: '11:00', temp: displayTempMax, iconCode: displayWeather.icon || '01d', desc: displayWeather.description },
    { time: '14:00', temp: displayTempMax + 1, iconCode: displayWeather.icon || '02d', desc: 'Peak Temp' },
    { time: '17:00', temp: displayTemp, iconCode: displayWeather.icon || '02d', desc: 'Afternoon' },
    { time: '20:00', temp: displayTempMin + 3, iconCode: '03d', desc: 'Evening' },
    { time: '23:00', temp: displayTempMin, iconCode: '01n', desc: 'Night' },
  ];

  // Quick switchable locations for the location button
  const quickLocations = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Munich', 'Berlin'];

  return (
    <div
      className="w-full text-slate-800 dark:text-slate-100 pb-6 transition-opacity duration-300"
      style={{ opacity: brightness / 100 }}
    >
      {/* 1. Station Top Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-2">
        {/* Left: Clock, Date, Interactive Location Picker Button */}
        <div className="flex items-center gap-6">
          <div className="text-5xl sm:text-6xl font-light tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md">
            {timeStr || '10:24'}
          </div>
          <div className="border-l border-slate-300 dark:border-white/20 pl-4 py-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-pre-line leading-snug">
              {activeDateStr}
            </p>
            {activeForecastDay && (
              <span className="inline-block mt-0.5 text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-400/20">
                Previewing {activeForecastDay.dayName}
              </span>
            )}
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setShowCityPicker((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 -ml-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
                title="Click to switch city"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:underline">
                  {current.cityName}, {current.country}
                </h2>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {/* City Quick Picker Dropdown */}
              {showCityPicker && (
                <div className="absolute top-full left-0 mt-2 z-50 glass-tile rounded-2xl p-2 w-48 border border-white/20 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Quick Select:
                  </p>
                  <div className="space-y-1">
                    {quickLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          onCityChange?.(loc);
                          setShowCityPicker(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          current.cityName.toLowerCase() === loc.toLowerCase()
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Weather Glance + WLAN Status */}
        <div className="flex items-center gap-4">
          {activeForecastDay && (
            <button
              type="button"
              onClick={() => onSelectDate?.('')}
              className="text-xs px-3 py-1.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              title="Return to live today weather"
            >
              Today ↺
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleUnit?.(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
            className="flex items-center gap-3 bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 transition-colors text-left shadow-2xs"
            title="Click to toggle between °C and °F"
          >
            <div className="w-10 h-10">
              <WeatherIcon weather={displayWeather} size="md" />
            </div>
            <div className="leading-tight">
              <span className="text-xs text-slate-600 dark:text-slate-300 block font-medium capitalize">
                {activeForecastDay ? `${activeForecastDay.dayName}: ` : ''}{displayWeather.description}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatTemperature(displayTemp, unit)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  ↑{formatTemperature(displayTempMax, unit, false)}° ↓{formatTemperature(displayTempMin, unit, false)}°
                </span>
              </div>
            </div>
          </button>

          {/* Wi-Fi Connected Badge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Wifi className="w-6 h-6 text-amber-500 dark:text-amber-400" aria-hidden="true" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">Wi-Fi</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">Connected</span>
          </div>
        </div>
      </div>

      {/* Conditional Active View Tab rendering */}
      {activeTab === 'calendar' ? (
        /* Monday to Sunday Interactive Calendar View with Calendar API Integration */
        <div className="glass-tile rounded-3xl p-6 sm:p-8 my-4 border border-white/10 space-y-6 animate-in fade-in zoom-in-95">
          {/* Calendar Header with Export Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-sky-400" aria-hidden="true" />
                <h3 className="text-xl font-bold text-white">
                  Monday to Sunday Calendar • {current.cityName}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Full 7-day schedule synced with real-time OpenWeather condition forecasts.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* iCalendar (.ics) Export button compatible with Apple, Outlook, Google */}
              <button
                type="button"
                onClick={() => downloadCalendarIcs(current.cityName, forecast, unit)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
                title="Download .ics file for Apple Calendar, Microsoft Outlook, or Google Calendar"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Export (.ics)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('weather')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* 7-Day Monday to Sunday Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekWithWeather.map((day) => {
              const hasForecast = !!day.forecast;
              const f = day.forecast;
              const isSelected = selectedDate === f?.date;

              return (
                <div
                  key={day.dayName}
                  className={`rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                    day.isToday
                      ? 'bg-blue-600/30 border-blue-400 shadow-md ring-2 ring-blue-400/40'
                      : isSelected
                      ? 'bg-sky-500/20 border-sky-400 ring-1 ring-sky-300'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                        {day.dayName}
                      </span>
                      <p className="text-[10px] text-slate-400">{day.dateKey.slice(5)}</p>
                    </div>
                    {day.isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Weather Illustration & Temp */}
                  <div className="my-3 flex flex-col items-center text-center">
                    {hasForecast && f ? (
                      <>
                        <div className="w-12 h-12 flex items-center justify-center my-1">
                          <WeatherIcon weather={f.weather} size="md" />
                        </div>
                        <span className="text-base font-extrabold text-white">
                          {formatTemperature(f.tempMax, unit, false)}°
                        </span>
                        <span className="text-[10px] text-slate-300 capitalize line-clamp-1 mt-0.5">
                          {f.weather.description}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Low: {formatTemperature(f.tempMin, unit, false)}°
                        </span>
                      </>
                    ) : (
                      <div className="py-4 text-center">
                        <Sun className="w-8 h-8 text-slate-500 mx-auto opacity-40 mb-1" />
                        <span className="text-[11px] text-slate-400">Past / Schedule</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action: Preview day on dashboard or add to Google Calendar API */}
                  <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5 text-center">
                    {hasForecast && f && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectDate?.(f.date);
                            setActiveTab('weather');
                          }}
                          className="w-full py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          Preview Day
                        </button>
                        <a
                          href={getGoogleCalendarUrl(current.cityName, f, unit)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 font-medium py-0.5 transition-colors"
                          title="Add event to Google Calendar"
                        >
                          <span>Google Cal</span>
                          <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Information Bar */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>
              ℹ Real-time calendar synchronization active for <strong>{current.cityName}</strong>.
            </span>
            <span className="text-slate-300">
              Standard RFC 5545 iCalendar format compatible across all platforms.
            </span>
          </div>
        </div>
      ) : activeTab === 'photoFrame' ? (
        /* Ambient Nature Landscapes in Display Mode */
        <div className="glass-tile rounded-3xl p-6 sm:p-8 my-4 border border-white/10 shadow-2xl space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">Ambient Nature Landscapes</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Display Mode
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Enjoy ambient nature landscapes in display mode with live weather stats and peaceful horizons.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={() => setIsLandscapePlaying((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isLandscapePlaying
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/15'
                }`}
                title={isLandscapePlaying ? 'Pause ambient slideshow' : 'Resume ambient slideshow'}
              >
                {isLandscapePlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Autoplay Active</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Paused</span>
                  </>
                )}
              </button>

              {/* Fullscreen Landscape Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsLandscapeFullscreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                title="Open ambient theater display mode"
              >
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Full Display</span>
              </button>

              {/* Back to Weather */}
              <button
                type="button"
                onClick={() => setActiveTab('weather')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Back to Station
              </button>
            </div>
          </div>

          {/* Main Panorama Showcase Window */}
          {(() => {
            const activeLandscape = natureLandscapes[currentLandscapeIndex];
            return (
              <div className="space-y-4">
                <div
                  className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-700 flex flex-col justify-between p-6 sm:p-8"
                  style={{
                    backgroundImage: activeLandscape.svgArt,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Subtle Gradient Atmosphere Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/40 pointer-events-none" />

                  {/* Top Bar inside Panorama: Location Badge & Live Weather Info */}
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {activeLandscape.location}
                      </span>
                      <span className="hidden sm:inline-flex px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-slate-200">
                        {activeLandscape.timeOfDay}
                      </span>
                    </div>

                    {/* Synchronized Ambient Station Weather Overlay */}
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <WeatherIcon weather={current.weather} size="sm" />
                        <span>{formatTemperature(current.temperature, unit)}</span>
                      </div>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-300 font-medium">{current.cityName}</span>
                    </div>
                  </div>

                  {/* Panorama Navigation Chevrons */}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentLandscapeIndex((prev) =>
                        prev === 0 ? natureLandscapes.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                    aria-label="Previous nature landscape"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentLandscapeIndex((prev) => (prev + 1) % natureLandscapes.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                    aria-label="Next nature landscape"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Bottom Captions & Atmospheric Details */}
                  <div className="relative z-10 max-w-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {activeLandscape.tag}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-300 font-mono">
                        {currentLandscapeIndex + 1} / {natureLandscapes.length}
                      </span>
                    </div>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                      {activeLandscape.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow">
                      {activeLandscape.description}
                    </p>
                  </div>
                </div>

                {/* Thumbnails Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {natureLandscapes.map((landscape, idx) => {
                    const isSelected = idx === currentLandscapeIndex;
                    return (
                      <button
                        key={landscape.id}
                        type="button"
                        onClick={() => setCurrentLandscapeIndex(idx)}
                        className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-400 shadow-lg ring-2 ring-blue-500/40 scale-[1.02]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div
                          className="w-full h-16 rounded-xl mb-2 overflow-hidden border border-white/10 relative"
                          style={{
                            backgroundImage: landscape.svgArt,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <span className="font-bold text-xs text-white line-clamp-1">
                          {landscape.title}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {landscape.location}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      ) : activeTab === 'settings' ? (
        /* Settings Modal / Tab View */
        <div className="glass-tile rounded-3xl p-8 my-4 border border-white/10 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Station Settings
          </h3>
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <p className="font-semibold text-white">Temperature Unit</p>
                <p className="text-xs text-slate-400">Current: {unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggleUnit?.(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              >
                Switch to {unit === 'celsius' ? '°F' : '°C'}
              </button>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <p className="font-semibold text-white">Display Brightness</p>
                <p className="text-xs text-slate-400">{brightness}% Level</p>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-32 accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Auto Refresh</p>
                <p className="text-xs text-slate-400">Sensor and forecast data updates every 60s</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('weather')}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Dashboard Tiles when activeTab === 'weather' */
        <>
          {/* 2. Main High-Density Sensor & Forecast Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {/* Card 1: City Station Climate Sensor */}
            <button
              type="button"
              onClick={() => setActiveRoomIndex(0)}
              className={`glass-tile rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 text-left cursor-pointer ${
                activeRoomIndex === 0 ? 'ring-2 ring-emerald-400/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Home className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{current.cityName} Station</h4>
                  <p className="text-[11px] text-slate-400">Indoor Sensor • Office</p>
                </div>
              </div>

              {/* Temperature */}
              <div className="my-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-7 h-7 text-emerald-400 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {formatTemperature(indoorOfficeTemp, unit, false)}
                    </span>
                    <span className="text-base text-slate-300 font-medium">°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-400 font-semibold ml-10">
                  {indoorOfficeTemp > 24 ? 'Warm & Cozy' : 'Comfortable'}
                </p>
              </div>

              {/* Humidity */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-sky-400 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{displayHumidity}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 ml-9">Relative Humidity</p>
              </div>

              {/* CO2 Indicator */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  <div>
                    <div className="flex items-baseline gap-1 text-xs font-bold text-white">
                      <span>CO₂</span>
                      <span className="text-emerald-400 text-sm">612</span>
                      <span className="text-[10px] text-slate-400 font-normal">ppm</span>
                    </div>
                    <p className="text-[10px] text-emerald-400">Excellent</p>
                  </div>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-400 rounded-full" />
                </div>
              </div>
            </button>

            {/* Card 2: Living Room Sensor */}
            <button
              type="button"
              onClick={() => setActiveRoomIndex(1)}
              className={`glass-tile rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 text-left cursor-pointer ${
                activeRoomIndex === 1 ? 'ring-2 ring-amber-400/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Home className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Indoor Sensor</h4>
                  <p className="text-[11px] text-slate-400">Living Room</p>
                </div>
              </div>

              {/* Temperature */}
              <div className="my-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-7 h-7 text-amber-400 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {formatTemperature(indoorLivingTemp, unit, false)}
                    </span>
                    <span className="text-base text-slate-300 font-medium">°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
                  </div>
                </div>
                <p className="text-xs text-amber-400 font-semibold ml-10">Comfortable</p>
              </div>

              {/* Humidity */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-sky-400 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{Math.max(30, displayHumidity - 4)}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 ml-9">Relative Humidity</p>
              </div>

              {/* Micro sparkline graph */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <svg className="w-24 h-6 text-sky-400" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 16 Q25 8 50 14 T100 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-sky-300">↓ -0.3°</span>
                  <p className="text-[9px] text-slate-400">vs. yesterday</p>
                </div>
              </div>
            </button>

            {/* Card 3: Outdoor Garden Sensor */}
            <button
              type="button"
              onClick={() => setActiveRoomIndex(2)}
              className={`glass-tile rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 text-left cursor-pointer ${
                activeRoomIndex === 2 ? 'ring-2 ring-teal-400/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                  <Trees className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {activeForecastDay ? `${activeForecastDay.dayName} Outlook` : 'Outdoor Sensor'}
                  </h4>
                  <p className="text-[11px] text-slate-400 capitalize">{displayWeather.description}</p>
                </div>
              </div>

              {/* Outside Temperature */}
              <div className="my-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-7 h-7 text-teal-400 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {formatTemperature(outdoorTemp, unit, false)}
                    </span>
                    <span className="text-base text-slate-300 font-medium">°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
                  </div>
                </div>
                <p className="text-xs text-teal-300 font-semibold ml-10">
                  {outdoorTemp < 15 ? 'Cool' : outdoorTemp < 23 ? 'Fresh' : 'Warm'}
                </p>
              </div>

              {/* Outside Humidity */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-sky-400 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{current.humidity}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 ml-9">Relative Humidity</p>
              </div>

              {/* Outside sparkline */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <svg className="w-24 h-6 text-teal-400" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 18 Q20 22 45 10 T100 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-teal-300">↑ +1.1°</span>
                  <p className="text-[9px] text-slate-400">vs. yesterday</p>
                </div>
              </div>
            </button>

            {/* Card 4: Recent Searches with Scroll Bar */}
            <div className="glass-tile rounded-3xl p-5 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">Recent Searches</h4>
                    <p className="text-[11px] text-slate-400">Quickly switch between cities</p>
                  </div>
                </div>
                <span className="text-[10px] text-sky-400 font-medium px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20">
                  {recentSearches.length > 0 ? `${recentSearches.length} saved` : 'Favorites'}
                </span>
              </div>

              {/* Horizontally scrollable recent searches chip list with custom scrollbar */}
              <div className="my-2 relative">
                <div
                  ref={recentSearchesScrollRef}
                  className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 custom-scrollbar"
                  tabIndex={0}
                  role="region"
                  aria-label="Recent searches horizontal scroller"
                >
                  {(recentSearches.length > 0
                    ? recentSearches.map((s) => s.name)
                    : ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Rome', 'Dubai', 'Singapore']
                  ).map((city) => {
                    const isCurrent = current.cityName.toLowerCase() === city.toLowerCase();
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => (onSelectSearch ? onSelectSearch(city) : onCityChange?.(city))}
                        className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10 hover:border-white/25 hover:text-white'
                        }`}
                        title={`View weather for ${city}`}
                      >
                        <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-sky-400'}`} aria-hidden="true" />
                        <span>{city}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom bar with active city and clickable scroll controls */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">Active: <strong className="text-white">{current.cityName}</strong></span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-sky-400 font-medium">Scroll</span>
                  <button
                    type="button"
                    onClick={() => scrollRecentSearches('left')}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Scroll left"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRecentSearches('right')}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Scroll right"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Middle Interactive Row: Radar, Air Quality, Sun/Moon, Quotes, Webcam */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mt-4">
            {/* Left Column (5 cols): Air Quality & Sun Times */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Air Quality Card */}
              <div className="glass-tile rounded-3xl p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-slate-300">
                      {activeForecastDay ? `${activeForecastDay.dayName} Air Quality` : 'Air Quality'}
                    </p>
                    <p className="text-sm font-bold text-emerald-400">{displayAirQuality}</p>
                  </div>
                </div>

                {/* Rainbow gradient spectrum slider bar */}
                <div className="my-3">
                  <div className="h-2 w-full rounded-full bg-linear-to-r from-emerald-400 via-yellow-400 via-orange-400 to-fuchsia-600 relative">
                    <div
                      className="absolute -top-1 w-4 h-4 rounded-full bg-white shadow-md border-2 border-slate-900 transition-all duration-300"
                      style={{ left: displayAirQuality === 'Very Good' ? '18%' : '48%' }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {displayAirQuality === 'Very Good'
                    ? '☺ Enjoy the fresh outdoor air!'
                    : 'Air is moderate. Sensitive individuals take care.'}
                </p>
              </div>

              {/* Sun Times & Atmospheric Specs */}
              <div className="glass-tile rounded-3xl p-5 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                      <Sunrise className="w-4 h-4" aria-hidden="true" />
                      <span className="text-[10px] text-slate-300 font-medium">Sunrise</span>
                    </div>
                    <span className="text-xs font-bold text-white">{sunriseStr}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-orange-400 mb-0.5">
                      <Sunset className="w-4 h-4" aria-hidden="true" />
                      <span className="text-[10px] text-slate-300 font-medium">Sunset</span>
                    </div>
                    <span className="text-xs font-bold text-white">{sunsetStr}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-white/10 mt-2">
                  <div>
                    <span className="text-[10px] text-amber-300 font-medium">Wind Speed</span>
                    <p className="text-xs font-bold text-white">{displayWind} <span className="text-[10px] text-slate-400 font-normal">m/s</span></p>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-300 font-medium">Pressure</span>
                    <p className="text-xs font-bold text-white">{current.pressure} <span className="text-[9px] text-slate-400 font-normal">hPa</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center / Right Column (7 cols): Weather Radar Map + Webcam Live + Quote */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rain Radar Tile */}
              <button
                type="button"
                onClick={() => setShowRadarModal(true)}
                className="glass-tile rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden group cursor-pointer text-left w-full hover:border-sky-400/40 transition-colors"
                title="Click to expand rain radar"
              >
                <div className="flex items-center justify-between mb-2 z-10 w-full">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    Rain Radar • {current.cityName}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>

                {/* Radar Satellite Map Graphic */}
                <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Cdefs%3E%3CradialGradient id='rad' cx='40%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%2300ffcc' stop-opacity='0.8'/%3E%3Cstop offset='40%25' stop-color='%230066ff' stop-opacity='0.6'/%3E%3Cstop offset='70%25' stop-color='%23001144' stop-opacity='0.4'/%3E%3Cstop offset='100%25' stop-color='%23000511' stop-opacity='0.8'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='%23112233'/%3E%3Ccircle cx='180' cy='100' r='90' fill='url(%23rad)' filter='blur(20px)'/%3E%3Cpath d='M30,120 Q120,40 220,130 T380,80' stroke='%2338bdf8' stroke-width='4' fill='none' opacity='0.7'/%3E%3Ccircle cx='210' cy='95' r='4' fill='%23ef4444'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Precipitation
                  </div>
                </div>
              </button>

              {/* Live Webcam & Outlook Overview Card */}
              <div className="glass-tile rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-blue-950/70 border border-white/10">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-400" />
                    City Outlook • {current.cityName}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                
                {/* Visual Panorama Graphic */}
                <div className="my-2.5 h-24 rounded-2xl overflow-hidden relative border border-white/10 bg-slate-950 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-bottom opacity-75"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 300'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e3a8a'/%3E%3Cstop offset='60%25' stop-color='%2338bdf8'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='500' height='300' fill='url(%23sky)'/%3E%3Cpolygon points='100,180 140,250 80,250' fill='%23020617'/%3E%3Crect x='160' y='140' width='50' height='160' fill='%23020617'/%3E%3Crect x='230' y='90' width='35' height='210' fill='%23020617'/%3E%3Cpolygon points='247,40 230,90 265,90' fill='%23020617'/%3E%3Crect x='280' y='160' width='60' height='140' fill='%23020617'/%3E%3Crect x='360' y='180' width='70' height='120' fill='%23020617'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <span className="relative z-10 text-xs font-medium text-white px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xs">
                    {current.cityName} Skyline View
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowWebcamModal(true)}
                    className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
                  >
                    <span>Expand Webcam</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-300">Updated Real-Time</span>
                </div>
              </div>
            </div>
          </div>

        </>
      )}

      {/* 4. Bottom Weather Station Navigation Dock */}
      <div className="mt-6 p-2 rounded-2xl glass-tile flex flex-wrap items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-2">
          {/* Weather Station Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'weather'
                ? 'glass-tile-active text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>Weather Station</span>
          </button>

          {/* Ambient Nature Landscapes Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('photoFrame')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'photoFrame'
                ? 'glass-tile-active text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Enjoy ambient nature landscapes in display mode"
          >
            <Mountain className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Nature Landscapes</span>
          </button>

          {/* Settings Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'glass-tile-active text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Brightness Toggle */}
          <button
            type="button"
            onClick={() => {
              setBrightness((prev) => (prev <= 50 ? 100 : prev - 25));
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all"
            title={`Adjust brightness (${brightness}%)`}
          >
            <SunMedium className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span className="hidden sm:inline">Brightness ({brightness}%)</span>
          </button>
        </div>
      </div>

      {/* Radar Detailed Modal */}
      {showRadarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-tile rounded-3xl p-6 max-w-lg w-full border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">Live Rain Radar: {current.cityName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRadarModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full h-64 rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%230f172a'/%3E%3Ccircle cx='200' cy='125' r='110' stroke='%2338bdf8' stroke-width='1' fill='none' opacity='0.3'/%3E%3Ccircle cx='200' cy='125' r='60' stroke='%2338bdf8' stroke-width='1' fill='none' opacity='0.5'/%3E%3Cpath d='M50,150 Q180,60 280,160 T380,100' stroke='%2334d399' stroke-width='5' fill='none' opacity='0.7'/%3E%3Ccircle cx='200' cy='125' r='6' fill='%23ef4444'/%3E%3C/svg%3E")`,
                }}
              />
              <span className="relative px-3 py-1 rounded-lg bg-black/60 text-xs font-mono text-emerald-400">
                Precipitation-free for the next 90 minutes
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRadarModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webcam Live Modal */}
      {showWebcamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-tile rounded-3xl p-6 max-w-lg w-full border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Live Webcam Panorama • {current.cityName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWebcamModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full h-64 rounded-2xl bg-slate-900 relative overflow-hidden flex flex-col justify-end p-4 border border-white/10">
              {/* Skyline Silhouette */}
              <div
                className="absolute inset-0 bg-cover bg-bottom opacity-75"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 300'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e3a8a'/%3E%3Cstop offset='60%25' stop-color='%23f97316'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='500' height='300' fill='url(%23sky)'/%3E%3Cpolygon points='100,180 140,250 80,250' fill='%23020617'/%3E%3Crect x='160' y='140' width='50' height='160' fill='%23020617'/%3E%3Crect x='230' y='90' width='35' height='210' fill='%23020617'/%3E%3Cpolygon points='247,40 230,90 265,90' fill='%23020617'/%3E%3Crect x='280' y='160' width='60' height='140' fill='%23020617'/%3E%3Crect x='360' y='180' width='70' height='120' fill='%23020617'/%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative z-10 flex items-center justify-between text-xs bg-black/50 backdrop-blur-md p-2 rounded-xl">
                <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  REC • 1080p HD LIVE
                </span>
                <span className="text-slate-300 font-medium">City Skyline View</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowWebcamModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Full Display Theater Mode for Ambient Nature Landscapes */}
      {isLandscapeFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in">
          {(() => {
            const activeLandscape = natureLandscapes[currentLandscapeIndex];
            return (
              <div className="relative w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between p-6 sm:p-12">
                {/* Background Artwork */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{
                    backgroundImage: activeLandscape.svgArt,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/50 pointer-events-none" />

                {/* Top Bar */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {activeLandscape.location}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-xs text-slate-200">
                      {activeLandscape.timeOfDay}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Live Clock & Temp */}
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="font-mono font-bold text-sm">{timeStr}</span>
                      <span className="text-slate-400">|</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <WeatherIcon weather={current.weather} size="sm" />
                        <span>{formatTemperature(current.temperature, unit)}</span>
                      </div>
                    </div>

                    {/* Exit Fullscreen */}
                    <button
                      type="button"
                      onClick={() => setIsLandscapeFullscreen(false)}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                      title="Exit Full Display"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Left/Right Navigation */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentLandscapeIndex((prev) =>
                      prev === 0 ? natureLandscapes.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  aria-label="Previous landscape"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentLandscapeIndex((prev) => (prev + 1) % natureLandscapes.length)
                  }
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  aria-label="Next landscape"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Bottom Bar: Title, Playback & Dots */}
                <div className="relative z-10 flex flex-col sm:flex-row items-end justify-between gap-6">
                  <div className="max-w-2xl space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {activeLandscape.tag} • Nature Display Mode
                    </span>
                    <h3 className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg">
                      {activeLandscape.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-200 drop-shadow">
                      {activeLandscape.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <button
                      type="button"
                      onClick={() => setIsLandscapePlaying((prev) => !prev)}
                      className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer hover:text-emerald-300 transition-colors"
                    >
                      {isLandscapePlaying ? (
                        <>
                          <Pause className="w-4 h-4 text-emerald-400" />
                          <span>Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-slate-300" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-1.5">
                      {natureLandscapes.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setCurrentLandscapeIndex(dotIdx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            dotIdx === currentLandscapeIndex
                              ? 'bg-emerald-400 w-6'
                              : 'bg-white/30 hover:bg-white/60'
                          }`}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
