// OpenWeather API Types and Internal Domain Types

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level?: number;
    grnd_level?: number;
    humidity: number;
    temp_kf?: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Clean internal application domain models

export interface CurrentWeatherData {
  cityName: string;
  country: string;
  state?: string;
  coordinates: Coordinates;
  temperature: number; // Celsius
  feelsLike: number; // Celsius
  tempMin: number; // Celsius
  tempMax: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // hPa
  visibility: number; // meters
  windSpeed: number; // m/s
  windDirection: number; // degrees
  weather: WeatherCondition;
  timestamp: number; // Unix timestamp seconds
  timezoneOffset: number; // seconds
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g., 'Mon', 'Tuesday'
  tempMin: number; // Celsius
  tempMax: number; // Celsius
  weather: WeatherCondition;
  precipitationProbability: number; // 0 to 1
  avgHumidity: number;
  avgWindSpeed: number;
}

export interface WeatherDashboardData {
  current: CurrentWeatherData;
  forecast: DailyForecast[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type ThemeMode = 'light' | 'dark';
