import { useEffect, useCallback, useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './features/search';
import { CurrentWeather, Forecast, WeatherDetails } from './features/weather';
import { DashboardSkeleton } from './components/SkeletonLoader';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { WeatherStation } from './components/WeatherStation';
import { useWeather } from './hooks/useWeather';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useTheme } from './hooks/useTheme';
import { useGeolocation } from './hooks/useGeolocation';
import { useTemperature } from './hooks/useTemperature';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { unit, setUnit } = useTemperature();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const [viewMode, setViewMode] = useState<'station' | 'standard'>('station');

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'station' ? 'standard' : 'station'));
  };

  const [selectedForecastDate, setSelectedForecastDate] = useState<string | null>(null);

  const toggleSelectDate = (date: string) => {
    setSelectedForecastDate((prev) => (prev === date ? null : date));
  };

  const handleSearchSuccess = useCallback(
    (cityName: string, country?: string) => {
      addSearch(cityName, country);
      setSelectedForecastDate(null);
    },
    [addSearch]
  );

  const {
    weatherData,
    isLoading,
    error,
    errorCode,
    searchCity,
    fetchByCoordinates,
    retryLastSearch,
  } = useWeather(handleSearchSuccess);

  const {
    isLoading: isLocationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation();

  // Selected forecast day object (if any day like Wednesday is clicked)
  const selectedForecastDay =
    weatherData?.forecast.find((f) => f.date === selectedForecastDate) || null;

  // Initial load: Load London or first saved city by default to immediately display the complete dashboard
  useEffect(() => {
    const initialCity = recentSearches.length > 0 ? recentSearches[0].name : 'London';
    searchCity(initialCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseCurrentLocation = () => {
    getLocation((coords) => {
      fetchByCoordinates(coords);
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        viewMode === 'station'
          ? theme === 'dark'
            ? 'weather-station-bg text-slate-100'
            : 'weather-station-bg-light text-slate-800'
          : 'bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        unit={unit}
        onToggleUnit={setUnit}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-4">
        {/* Search Bar */}
        <div>
          <SearchBar
            onSearch={(city) => {
              searchCity(city);
            }}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoading={isLoading}
            isLocationLoading={isLocationLoading}
          />
        </div>

        {/* Geolocation or Network Error Alert */}
        {(locationError || (error && !isLoading)) && (
          <ErrorMessage
            message={locationError || error || ''}
            code={locationError ? 'GEOLOCATION_ERROR' : errorCode}
            onRetry={locationError ? handleUseCurrentLocation : retryLastSearch}
          />
        )}

        {/* Main Dashboard Display: Loading Skeleton vs Weather Station View vs Standard 2-Column View */}
        {isLoading ? (
          <DashboardSkeleton />
        ) : weatherData ? (
          viewMode === 'station' ? (
            <div className="space-y-4">
              {/* Premium Alpine Weather Station Theme */}
              <WeatherStation
                current={weatherData.current}
                forecast={weatherData.forecast}
                unit={unit}
                onCityChange={searchCity}
                onToggleUnit={setUnit}
                selectedDate={selectedForecastDate}
                onSelectDate={toggleSelectDate}
                recentSearches={recentSearches}
                onSelectSearch={(city) => {
                  searchCity(city);
                }}
              />

              {/* 5-Day Forecast Card Row for full depth */}
              <div className="glass-tile rounded-3xl p-5 border border-white/10">
                <Forecast
                  forecast={weatherData.forecast}
                  unit={unit}
                  selectedDate={selectedForecastDate}
                  onSelectDate={toggleSelectDate}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              {/* Left Column (8 cols): Current Weather Card & 5-Day Forecast */}
              <div className="lg:col-span-8 space-y-5">
                <CurrentWeather
                  data={weatherData.current}
                  unit={unit}
                  selectedForecastDay={selectedForecastDay}
                  onClearSelectedDay={() => setSelectedForecastDate(null)}
                />
                <Forecast
                  forecast={weatherData.forecast}
                  unit={unit}
                  selectedDate={selectedForecastDate}
                  onSelectDate={toggleSelectDate}
                />
              </div>

              {/* Right Column (4 cols): Weather Details Card & Vertical Recent Searches */}
              <div className="lg:col-span-4">
                <WeatherDetails
                  data={weatherData.current}
                  unit={unit}
                  recentSearches={recentSearches}
                  onSelectSearch={(city) => {
                    searchCity(city);
                  }}
                  onRemoveSearch={removeSearch}
                />
              </div>
            </div>
          )
        ) : null}
      </main>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
}

export default App;
