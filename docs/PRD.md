# Product Requirements Document (PRD) — Weather Dashboard

**Document Version**: 2.2.0  
**Status**: Implemented & Production-Ready  
**Application Name**: Weather Dashboard  
**Framework**: React 19, TypeScript, Vite, Tailwind CSS v4  

---

## 1. Executive Summary & Vision

Weather Dashboard is a modern, high-density weather station and meteorological forecasting application. Designed for precision, accessibility, and visual elegance, it combines real-time weather monitoring, a synchronized 7-day Monday-to-Sunday weekly forecast, native calendar event export (RFC 5545 iCalendar & Google Calendar API), and an ambient nature landscape display mode with living microclimate sensor monitoring.

---

## 2. Target Users & Problem Statement

### 2.1 Target Audiences
- **Everyday Commuters & Travelers**: Individuals planning daily commutes, weekend travel, or international trips needing instant local time and accurate 7-day weather.
- **Smart-Home & Office Display Users**: Users keeping a dedicated tablet, monitor, or dashboard display showing living weather conditions, indoor/outdoor microclimate comfort, and ambient scenic backgrounds.
- **Productivity & Calendar Planners**: Professionals who need one-click export of weather forecasts into their work calendars (Google Calendar, Apple Calendar, Outlook).

### 2.2 Problem Statement
Traditional weather widgets are either cluttered with intrusive ads, lack weekly calendar context (forcing users to mentally calculate date offsets), or provide generic static icons that fail to reflect human-centered recommendations. Weather Dashboard solves these problems by delivering a clean, advertising-free, responsive dashboard featuring human-designed icons, full 7-day Monday–Sunday views, timezone-accurate local clocks, and direct calendar integrations.

---

## 3. Core Feature Requirements

### 3.1 Dual Viewing Modes
- **Weather Station Mode (`WeatherStation`)**:
  - High-density smart-living dashboard inspired by modern climate stations.
  - Live digital clock and calendar date dynamically synchronized to the searched city's exact timezone offset (`current.timezoneOffset`).
  - Multi-sensor monitoring grid:
    - **Station Indoor Climate Sensor**: Temperature, humidity, CO₂ air quality indicators.
    - **Living Room Sensor**: Microclimate tracking with 24-hour differential trend indicators.
    - **Outdoor Sensor**: Direct real-time temperature, humidity, and condition description for the searched location.
    - **Recent Searches Scroll Bar**: Horizontally scrollable recent searches chip list with left/right navigation controls.
  - Center meteorological modules:
    - **Rain Radar Preview**: Satellite radar map preview with a full-screen interactive modal and precipitation tracker.
    - **Live City Skyline Outlook**: HD panoramic skyline view with expand-to-panorama webcam modal.
    - **Sun & Moon Cycles**: Astronomical sunrise and sunset calculated to the destination city's local dawn/dusk hours.
    - **Atmospheric Barometer & Wind**: Precise hectopascal (hPa) atmospheric pressure and wind vectors.

- **Standard 2-Column Mode (`CurrentWeather` & `WeatherDetails`)**:
  - Clean two-column responsive layout with hero weather display, detail metrics, and quick search history.

### 3.2 7-Day Monday to Sunday Weekly Forecast
- **Full 7-Day Layout**: Renders all 7 days of the week in chronological sequence (**Mon, Tue, Wed, Thu, Fri, Sat, Sun**).
- **Responsive 7-Column Grid**: Responsive layout (`grid-cols-2 sm:grid-cols-4 lg:grid-cols-7`) with optimized padding and typography.
- **Interactive Day Inspection**:
  - Clicking any day (e.g. Wednesday or Sunday) immediately updates the entire dashboard to preview that day's temperatures, weather description, and climate parameters.
  - Displays a clean **`Reset to Today ↺`** action to restore real-time weather immediately.

### 3.3 Calendar & Event Integration (RFC 5545 & Google Calendar API)
- **Monday to Sunday Interactive Calendar Tab**:
  - Embedded full-week schedule with day-by-day temperature highs/lows and condition summaries.
- **iCalendar (.ics) Export**:
  - Generates RFC 5545 compliant `.ics` calendar files client-side.
  - Seamlessly imports full-week weather events into Apple Calendar, Microsoft Outlook, Thunderbird, and Google Calendar.
- **Google Calendar Direct Intent Web API**:
  - One-click links pre-populate Google Calendar with all-day weather events, highs, lows, humidity, and wind notes for any selected forecast day.

### 3.4 Ambient Nature Landscapes in Display Mode (Location-Aware Real-Time Engine)
- **Real-Time Procedural Nature Panorama Generator (`generateLocationNatureLandscape`)**:
  - Automatically synthesizes an atmospheric panoramic landscape reflecting the searched location's geography, current climate conditions, and destination local solar time.
  - **Solar Time Calculation**: Computes local destination hour using `current.timezoneOffset` to dynamically choose day/twilight/night palettes:
    - *Starlit Night Horizon* (hour < 6 or ≥ 21)
    - *Golden Twilight Vista* (hour 18–21 or 5–7)
    - *Midday Natural Light* (daytime)
  - **Atmospheric Climate Adaptation**:
    - **Electric Stormscape**: Lightning arcs over jagged wilderness summits (`thunder` / `storm`).
    - **Ethereal Mist**: Quiet cedar groves and waterways veiled in morning fog (`fog` / `mist` / `haze`).
    - **Live Rainfall**: Refreshing rain cascade over emerald forest ridges (`rain` / `drizzle`).
    - **Winter Snowscape**: Powdered snow blankets evergreen valleys (`snow` or temp ≤ 2°C).
    - **Cloud Horizon**: Rolling cloud strata across alpine plateaus (`clouds`).
    - **Sunlit Vista**: Sun-drenched open mountain ridges.
  - **Instant Search Activation**: Whenever a new city is searched or clicked, `setCurrentLandscapeIndex(0)` automatically selects the real-time panoramic card for that city.
- **Curated Global Nature Landscapes**:
  - **Alpine Peak Sunset** (Swiss Alps • 3,200m)
  - **Misty Nordic Fjord** (Geirangerfjord, Norway)
  - **Pacific Redwood Coast** (Big Sur, California)
  - **Kyoto Autumn Canopy** (Arashiyama, Japan)
- **Display Controls**:
  - 6-second auto-advancing slideshow with Play / Pause controls.
  - Interactive thumbnail strip for instant landscape switching.
  - **Full Display Theater Mode**: Immersive full-screen overlay with live time, weather badge, landscape description, and pagination dots.

### 3.5 Global Search, Geolocation & Offline Resiliency
- **OpenWeather Direct & Reverse Geocoding**: Direct search by city name, coordinates, or country code.
- **Browser Geolocation**: One-click "Use My Location" with reverse geocoding to city names.
- **Offline / Zero-Config Mock Data Engine**:
  - When an API key is not configured, the system provides deterministic mock weather profiles for hundreds of global cities (London, New York, Tokyo, Paris, Sydney, Munich, Berlin, etc.) with complete 7-day Monday–Sunday forecast data.
- **Recent Searches Persistence**: Stores search history in `localStorage` with deduplication and horizontal scrolling.
- **Client-Side Temperature Unit Conversion**: Instant toggle between Celsius (°C) and Fahrenheit (°F) with zero re-fetching.
- **Theme Persistence**: Dark mode and light mode with system preference detection and smooth transitions.

---

## 4. Technical Architecture

### 4.1 Tech Stack Matrix
| Layer | Technology | Rationale |
|---|---|---|
| **UI Framework** | React 19 | Functional components, hooks, concurrent rendering |
| **Language** | TypeScript 5.9+ | Strict typing, robust interfaces, zero `any` policy |
| **Build Tool** | Vite 6+ | Sub-second HMR, optimized tree-shaking, fast production builds |
| **Styling** | Tailwind CSS v4 | Native CSS tokens, zero runtime overhead, dynamic glassmorphism |
| **Icons** | Lucide React | High-performance SVG icons |
| **Testing** | Vitest & React Testing Library | Fast unit and integration tests with DOM emulation |
| **Calendar Standard** | RFC 5545 (iCalendar) | Universal compatibility with Apple, Google, and Microsoft platforms |

### 4.2 State Flow Diagram
```
                     User Search / Location Trigger
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │     useWeather Hook      │
                     │  (AbortController fetch) │
                     └────────────┬─────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       Live OpenWeather API            Mock Weather Engine
       (When API key is present)       (Zero-config fallback)
                  │                               │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │    groupForecastByDay    │
                     │ (Local timezone shift)   │
                     └────────────┬─────────────┘
                                  │
       ┌──────────────────────────┴──────────────────────────┐
       ▼                                                     ▼
┌──────────────────────────┐                    ┌──────────────────────────┐
│  WeatherStation Display  │                    │  Forecast 7-Day Grid     │
│  - Timezone-synced clock │                    │  - Monday to Sunday      │
│  - Station sensors       │                    │  - Interactive preview   │
│  - Calendar sync (.ics)  │                    │  - Reset to today ↺      │
│  - Nature landscapes     │                    └──────────────────────────┘
└──────────────────────────┘
```

---

## 5. Non-Functional Requirements

1. **Performance**: Initial load under 1.5 seconds; client-side temperature toggles take 0ms (instant calculation).
2. **Accessibility**: Full semantic HTML (`<main>`, `<header>`, `<button>`, `<h1>`-`<h4>`), `aria-pressed`, `aria-label`, and high-contrast color ratios.
3. **Reliability**: Comprehensive test coverage across all utilities, hooks, search bars, and dashboard integration workflows.
4. **Security**: Client variables strictly read through Vite environment variables; no secrets leaked into source code.

---

## 6. Acceptance Criteria

- [x] Searching any location instantly updates the entire dashboard, including Weather Station clocks, sensor readings, and forecast cards.
- [x] The forecast strip renders all 7 days from Monday to Sunday in sequence.
- [x] Selecting any day previews that day's weather across the dashboard with a functional `Reset to Today ↺` button.
- [x] Calendar export provides downloadable `.ics` files and direct Google Calendar links.
- [x] Ambient nature landscapes display mode provides interactive slideshow, thumbnails, and full-theater display.
- [x] All 22 Vitest automated tests pass and production build compiles with zero errors.
