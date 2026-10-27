# Data Model & Schema Specification — Weather Dashboard

**Document Version**: 2.3.0  
**Language**: TypeScript 5.9+  
**File Location**: `src/types/weather.ts` & `src/utils/calendarUtils.ts`  

---

## 1. Entity Relationship Diagram (ERD)

```
┌────────────────────────────────────────────────────────┐
│                  WeatherDashboardData                  │
├──────────────────────────┬─────────────────────────────┤
│ current: CurrentWeather  │ forecast: DailyForecast[]   │
└────────────┬─────────────┴──────────────┬──────────────┘
             │                            │
             ▼                            ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│    CurrentWeatherData    │ │      DailyForecast       │
├──────────────────────────┤ ├──────────────────────────┤
│ cityName: string         │ │ date: string (YYYY-MM-DD)│
│ country: string          │ │ dayName: string (Mon-Sun)│
│ coordinates: Coordinates │ │ tempMin: number          │
│ temperature: number      │ │ tempMax: number          │
│ feelsLike: number        │ │ weather: WeatherCondition│
│ tempMin: number          │ │ precipitationProbability │
│ tempMax: number          │ │ avgHumidity: number      │
│ humidity: number         │ │ avgWindSpeed: number     │
│ pressure: number         │ └──────────────────────────┘
│ visibility: number       │              │
│ windSpeed: number        │              ▼
│ windDirection: number    │ ┌──────────────────────────┐
│ weather: WeatherCondition│ │     CalendarDayInfo      │
│ timestamp: number        │ ├──────────────────────────┤
│ timezoneOffset: number   │ │ dateKey: string          │
└──────────────────────────┘ │ dayName: string          │
                             │ dayNumber: number        │
                             │ isToday: boolean         │
                             │ forecast?: DailyForecast │
                             └──────────────────────────┘
```

---

## 2. Core TypeScript Interfaces

### 2.1 Geographic Coordinates
```typescript
export interface Coordinates {
  lat: number; // Latitude (-90 to +90)
  lon: number; // Longitude (-180 to +180)
}
```

### 2.2 Weather Condition Object
```typescript
export interface WeatherCondition {
  id: number;          // OpenWeather condition ID (e.g., 800 for Clear)
  main: string;        // Group: Rain, Snow, Clouds, Clear, Thunderstorm
  description: string; // Human-readable string: "scattered clouds"
  icon: string;        // OpenWeather icon code (e.g., "01d", "10n")
}
```

### 2.3 Current Weather Observation Model
```typescript
export interface CurrentWeatherData {
  cityName: string;
  country: string;
  state?: string;
  coordinates: Coordinates;
  temperature: number;      // Current temp in °C
  feelsLike: number;        // Apparent temp in °C
  tempMin: number;          // Daily low in °C
  tempMax: number;          // Daily high in °C
  humidity: number;         // Relative humidity (0 - 100%)
  pressure: number;         // Atmospheric pressure in hPa
  visibility: number;       // Atmospheric visibility in meters
  windSpeed: number;        // Wind speed in m/s
  windDirection: number;    // Wind direction in degrees (0 - 360)
  weather: WeatherCondition;
  timestamp: number;        // Unix epoch timestamp in seconds
  timezoneOffset: number;   // Destination timezone offset from UTC in seconds
}
```

### 2.4 Daily Forecast Summary (Monday to Sunday)
```typescript
export interface DailyForecast {
  date: string;                     // ISO Date string: "YYYY-MM-DD"
  dayName: string;                  // Three-letter weekday: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  tempMin: number;                  // Projected low in °C
  tempMax: number;                  // Projected high in °C
  weather: WeatherCondition;        // Representative condition for the day
  precipitationProbability: number; // Probability of precipitation (0.0 to 1.0)
  avgHumidity: number;              // Average relative humidity percentage
  avgWindSpeed: number;             // Average wind speed in m/s
}
```

### 2.5 Calendar Synchronization Schema
```typescript
export interface CalendarDayInfo {
  dateKey: string;           // "YYYY-MM-DD"
  dayName: string;           // "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  dayNumber: number;         // Day of month (1 - 31)
  isToday: boolean;          // True if day corresponds to current local date
  forecast?: DailyForecast;  // Weather data matching this date
}
```

### 2.6 Nature Landscape Schema
```typescript
export interface NatureLandscapeItem {
  id: string;               // Unique landscape ID
  title: string;            // Descriptive title (e.g. "Tokyo Starlit Alpine Reserve")
  location: string;         // Location badge text (e.g. "Tokyo, JP • Night Sky")
  timeOfDay: string;        // Solar phase (e.g. "Starlit Night Horizon")
  description: string;      // Poetic scenic description
  accent: string;           // Tailwind gradient overlay classes
  tag: string;              // Badge label (e.g. "Live Rainfall")
  gradientBg: string;       // Fallback CSS linear gradient
  svgArt: string;           // Data URI encoded SVG panoramic artwork
}
```

### 2.7 Recent Search History Persistence Schema
```typescript
export interface RecentSearchItem {
  id: string;          // UUID or unique hash
  name: string;        // City name (e.g., "Paris")
  country: string;     // Country code (e.g., "FR")
  timestamp: number;   // Epoch timestamp of search
}
```

---

## 3. Data Transformations & Normalization

1. **Timezone Shifting (`groupForecastByDay`)**:
   $$\text{localTimestamp} = (\text{item.dt} + \text{timezoneOffsetSeconds}) \times 1000$$
   This ensures that UTC API responses are bucketed into the destination's actual local calendar day.
2. **Deterministic Climate Hash (`getMockWeatherData`)**:
   When offline or without an API key, the city name string is passed through a 32-bit polynomial hash ($hash = hash \times 31 + char$) to generate unique, reproducible climate numbers (temp, humidity, wind) for any city worldwide.
