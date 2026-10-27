# Architecture and Design Specification — Weather Dashboard

## 1. Executive Overview

The Weather Dashboard is a production-grade, responsive single-page web application engineered with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. It interfaces directly with the **OpenWeather API** suite to provide real-time atmospheric metrics, 5-day calendar forecasts, client-side unit conversions, recent search history persistence, and device geolocation.

---

## 2. Core Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  Orchestrates state, layout, theme synchronization, and error handling  │
└───────┬────────────────────────────────┬───────────────────────────────┘
        │                                │
        ▼                                ▼
┌─────────────────┐             ┌────────────────────────────────────────┐
│ UI Components   │             │ Custom React Hooks                     │
├─────────────────┤             ├────────────────────────────────────────┤
│ Header          │             │ useWeather (state & cancellation)      │
│ SearchBar       │             │ useRecentSearches (localStorage)       │
│ SmartStation    │             │ useTheme (dark/light mode DOM sync)    │
│ CurrentWeather  │             │ useGeolocation (GPS & reverse geocode) │
│ Forecast (7-Day)│             └──────────────────┬─────────────────────┘
│ ForecastCard    │                                │
│ WeatherDetails  │                                ▼
│ SkeletonLoader  │             ┌────────────────────────────────────────┐
│ ErrorMessage    │             │ Service & Utility Layer                │
│ WeatherIcon     │             ├────────────────────────────────────────┤
└─────────────────┘             │ weatherService.ts (API integration)    │
                                │ mockWeatherData.ts (offline engine)    │
                                │ calendarUtils.ts (iCal & Mon-Sun week) │
                                │ forecastUtils.ts (timezone grouping)   │
                                │ temperatureUtils.ts (math conversions) │
                                └──────────────────┬─────────────────────┘
                                                   │
                                                   ▼
                                ┌────────────────────────────────────────┐
                                │ OpenWeather External REST API          │
                                │ /geo/1.0/direct                        │
                                │ /geo/1.0/reverse                       │
                                │ /data/2.5/weather                      │
                                │ /data/2.5/forecast                     │
                                └────────────────────────────────────────┘
```

---

## 3. Data Flow & State Management

### 3.1 Asynchronous Search & Request Cancellation
- Users submit queries through the `SearchBar` component.
- The `useWeather` hook manages request lifecycles using browser-native `AbortController` instances.
- When rapid searches occur, pending HTTP connections are immediately aborted via `controller.abort()`, preventing race conditions where older requests overwrite newer search results.

### 3.2 Forecast Grouping Algorithm (`src/utils/forecastUtils.ts`)
- OpenWeather's 5-day endpoint returns up to 40 records at 3-hour intervals in UTC.
- The grouping algorithm computes the destination's local calendar day using the city's `timezoneOffset` in seconds:
  $$\text{Local Time} = (\text{dt} + \text{timezoneOffset}) \times 1000$$
- Entries are grouped by local calendar date (`YYYY-MM-DD`). For each day:
  - **Daily Maximum ($T_{\max}$)**: Highest temperature recorded across all intervals.
  - **Daily Minimum ($T_{\min}$)**: Lowest temperature recorded across all intervals.
  - **Representative Condition**: Midday condition sampled between 11:00 and 15:00 local time.
  - **Averages**: Humidity and peak precipitation probability.

### 3.3 Client-Side Temperature Conversion (`src/utils/temperatureUtils.ts`)
- All metrics are retrieved and stored internally in metric units ($^\circ\text{C}$, $\text{m/s}$).
- Switching units to Fahrenheit applies pure mathematical transformation:
  $$F = C \times \frac{9}{5} + 32$$
  $$\text{mph} = \text{m/s} \times 2.23694$$
  $$\text{km/h} = \text{m/s} \times 3.6$$
- Temperature toggles execute entirely client-side without firing redundant network requests.

### 3.4 LocalStorage Defensive Persistence
- `useRecentSearches` stores up to 5 unique city names.
- Case-insensitive deduplication moves recently accessed cities to the beginning of the list.
- All storage calls are wrapped in `try...catch` blocks to protect against environments where `localStorage` is disabled or restricted.

---

## 4. Component Hierarchy

1. **`Header`**:
   - Branding logo with overlapping sun/cloud badge.
   - Temperature unit toggle pill (`°C` / `°F`).
   - Circular dark mode button.
2. **`SearchBar`**:
   - Rounded search capsule with embedded `Use My Location` pill.
   - Square blue submit button.
   - Client-side validation feedback.
3. **`SmartStation`**:
   - High-density smart-living meteorological station view.
   - Dynamic city synchronization: updates clock, local date, sunrise/sunset, and climate sensors for any searched city.
   - Multi-room sensor telemetry: Office Indoor Sensor (temp, humidity, CO₂), Living Room Sensor (differential tracking), Outdoor Sensor.
   - Rain Radar & City Outlook modules with modal expansions.
   - Integrated recent searches horizontal scroll container with directional navigation.
4. **`Forecast` & `ForecastCard`**:
   - 7-day responsive grid (`grid-cols-2 sm:grid-cols-4 lg:grid-cols-7`) displaying the full calendar week from Monday to Sunday.
   - Day selection triggers whole-dashboard preview mode with an accessible `Reset to Today ↺` button.
5. **`Calendar (Mon-Sun)` (via `calendarUtils.ts`)**:
   - Integrated full 7-day schedule view.
   - Client-side iCalendar (`.ics`) standard RFC 5545 generator compatible with Apple Calendar, Outlook, and Google Calendar.
   - Direct Google Calendar web intent link builder for adding forecast events.
6. **`Ambient Nature Landscapes Mode`**:
   - Living scenic landscape showcase with 6-second auto-advancing slideshow, playback controls, and thumbnail strip.
   - Immersive theater Full Display mode overlaying destination time and weather.
7. **`CurrentWeather` & `WeatherDetails`**:
   - Standard 2-column view displaying hero temperatures, metrics, and vertical search history.
8. **`SkeletonLoader` & `ErrorMessage`**:
   - Accessible shimmer loading states and contextual error alerts with retry triggers.
