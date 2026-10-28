import {
  Coordinates,
  GeocodingResult,
  CurrentWeatherResponse,
  ForecastResponse,
  WeatherDashboardData,
  CurrentWeatherData,
} from '../types/weather';
import { groupForecastByDay } from '../utils/forecastUtils';
import { apiRequest, ApiError, getApiKey, hasApiKey } from './apiClient';
import { getMockWeatherData } from './mockWeatherData';

export { ApiError as WeatherApiError, getApiKey, hasApiKey };

/**
 * Direct Geocoding for a city name.
 * Uses /geo/1.0/direct endpoint.
 */
export async function searchCity(
  cityName: string,
  signal?: AbortSignal
): Promise<GeocodingResult> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw new ApiError('Please enter a valid city name.', 400, 'INVALID_INPUT');
  }

  const results = await apiRequest<GeocodingResult[]>(
    '/geo/1.0/direct',
    { q: trimmed, limit: 1 },
    signal
  );

  if (!results || results.length === 0) {
    throw new ApiError(
      `City "${trimmed}" could not be found. Please check spelling or add a country code (e.g. "Paris, FR").`,
      404,
      'CITY_NOT_FOUND'
    );
  }

  return results[0];
}

// Alias for backwards compatibility
export const geocodeCity = searchCity;

/**
 * Fetch current weather data by city name directly.
 * Uses /data/2.5/weather endpoint in metric units (Celsius).
 */
export async function getCurrentWeatherByCity(
  cityName: string,
  signal?: AbortSignal
): Promise<CurrentWeatherResponse> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw new ApiError('Please enter a valid city name.', 400, 'INVALID_INPUT');
  }
  return apiRequest<CurrentWeatherResponse>(
    '/data/2.5/weather',
    { q: trimmed, units: 'metric' },
    signal
  );
}

/**
 * Fetch current weather data by coordinates.
 * Uses /data/2.5/weather endpoint in metric units (Celsius).
 */
export async function getCurrentWeather(
  coords: Coordinates,
  signal?: AbortSignal
): Promise<CurrentWeatherResponse> {
  return apiRequest<CurrentWeatherResponse>(
    '/data/2.5/weather',
    { lat: coords.lat, lon: coords.lon, units: 'metric' },
    signal
  );
}

// Alias for backwards compatibility
export const fetchCurrentWeather = getCurrentWeather;

/**
 * Fetch 5-day / 3-hour forecast data by coordinates.
 * Uses /data/2.5/forecast endpoint in metric units (Celsius).
 */
export async function getForecast(
  coords: Coordinates,
  signal?: AbortSignal
): Promise<ForecastResponse> {
  return apiRequest<ForecastResponse>(
    '/data/2.5/forecast',
    { lat: coords.lat, lon: coords.lon, units: 'metric' },
    signal
  );
}

// Alias for backwards compatibility
export const fetchForecast = getForecast;

/**
 * Reverse geocodes coordinates to a human-readable city name using /geo/1.0/reverse
 */
export async function reverseGeocode(
  coords: Coordinates,
  signal?: AbortSignal
): Promise<GeocodingResult | null> {
  try {
    const results = await apiRequest<GeocodingResult[]>(
      '/geo/1.0/reverse',
      { lat: coords.lat, lon: coords.lon, limit: 1 },
      signal
    );
    return results && results.length > 0 ? results[0] : null;
  } catch {
    return null;
  }
}

/**
 * Unified service method to load both current weather and 5-day forecast for given coordinates.
 * Executes parallel requests for current weather and 5-day forecast as depicted in the API flow.
 */
export async function getWeatherDataForCoords(
  coords: Coordinates,
  locationLabel?: { cityName?: string; country?: string; state?: string },
  signal?: AbortSignal
): Promise<WeatherDashboardData> {
  if (!hasApiKey()) {
    return getMockWeatherData(locationLabel?.cityName || 'London');
  }

  const [currentRaw, forecastRaw] = await Promise.all([
    getCurrentWeather(coords, signal),
    getForecast(coords, signal),
  ]);

  if (!forecastRaw.list || forecastRaw.list.length === 0) {
    throw new ApiError(
      'Forecast data is currently unavailable for this location.',
      500,
      'FORECAST_UNAVAILABLE'
    );
  }

  const primaryWeather =
    currentRaw.weather && currentRaw.weather.length > 0
      ? currentRaw.weather[0]
      : { id: 800, main: 'Clear', description: 'Clear sky', icon: '01d' };

  const current: CurrentWeatherData = {
    cityName: locationLabel?.cityName || currentRaw.name || 'Unknown Location',
    country: locationLabel?.country || currentRaw.sys?.country || '',
    state: locationLabel?.state,
    coordinates: coords,
    temperature: currentRaw.main.temp,
    feelsLike: currentRaw.main.feels_like,
    tempMin: currentRaw.main.temp_min,
    tempMax: currentRaw.main.temp_max,
    humidity: currentRaw.main.humidity,
    pressure: currentRaw.main.pressure,
    visibility: currentRaw.visibility,
    windSpeed: currentRaw.wind.speed,
    windDirection: currentRaw.wind.deg,
    weather: primaryWeather,
    timestamp: currentRaw.dt,
    timezoneOffset: currentRaw.timezone || 0,
  };

  const forecast = groupForecastByDay(forecastRaw.list, currentRaw.timezone || 0);

  return {
    current,
    forecast,
  };
}

/**
 * Unified service method to search weather by city name.
 * Uses /data/2.5/weather?q={CITY_NAME}&units=metric directly to fetch real-time weather,
 * and fetches the 5-day forecast using the coordinates returned.
 */
export async function getWeatherDataForCity(
  cityName: string,
  signal?: AbortSignal
): Promise<WeatherDashboardData> {
  if (!hasApiKey()) {
    return getMockWeatherData(cityName);
  }

  // Directly fetch current weather for the requested city
  const currentRaw = await getCurrentWeatherByCity(cityName, signal);
  const coords: Coordinates = {
    lat: currentRaw.coord.lat,
    lon: currentRaw.coord.lon,
  };

  const forecastRaw = await getForecast(coords, signal);

  if (!forecastRaw.list || forecastRaw.list.length === 0) {
    throw new ApiError(
      'Forecast data is currently unavailable for this location.',
      500,
      'FORECAST_UNAVAILABLE'
    );
  }

  const primaryWeather =
    currentRaw.weather && currentRaw.weather.length > 0
      ? currentRaw.weather[0]
      : { id: 800, main: 'Clear', description: 'Clear sky', icon: '01d' };

  const current: CurrentWeatherData = {
    cityName: currentRaw.name || cityName,
    country: currentRaw.sys?.country || '',
    coordinates: coords,
    temperature: currentRaw.main.temp,
    feelsLike: currentRaw.main.feels_like,
    tempMin: currentRaw.main.temp_min,
    tempMax: currentRaw.main.temp_max,
    humidity: currentRaw.main.humidity,
    pressure: currentRaw.main.pressure,
    visibility: currentRaw.visibility,
    windSpeed: currentRaw.wind.speed,
    windDirection: currentRaw.wind.deg,
    weather: primaryWeather,
    timestamp: currentRaw.dt,
    timezoneOffset: currentRaw.timezone || 0,
  };

  const forecast = groupForecastByDay(forecastRaw.list, currentRaw.timezone || 0);

  return {
    current,
    forecast,
  };
}
