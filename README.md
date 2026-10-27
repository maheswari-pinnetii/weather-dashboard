# Weather Dashboard — Professional Meteorological Weather Station & Forecasting Dashboard

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.5-green.svg?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, high-density Weather Station and meteorological dashboard engineered with **React 19**, **TypeScript 5.9**, **Vite 6**, **Tailwind CSS v4**, and the **OpenWeather API**. Atmospheric conditions and human comfort recommendations are uniquely visualized through **human-figure visual icons** (e.g., person with an umbrella for rain, person with sunglasses and summer brim hat for sunny days, person bundled in a puffer coat and scarf for sub-zero snow).

---

## 📚 Complete Technical & Product Documentation Hub

Weather Dashboard follows enterprise frontend engineering standards, providing thorough, synchronized documentation across product vision, UI/UX design, architecture, testing, and developer workflows. All specifications reside within the [`docs/`](docs/) directory:

### Product & Design
- 📋 [**Product Requirements Document (PRD.md)**](docs/PRD.md)
  *Product vision, user personas, functional specifications, real-time climate adaptation rules, and acceptance criteria.*
- 🎨 [**Design Brief & Design System (DESIGN_BRIEF.md)**](docs/DESIGN_BRIEF.md)
  *Design tokens, glassmorphism specs, light/dark color semantics, typography hierarchy, responsive breakpoints, and WCAG AA accessibility standards.*
- 🗺️ [**User Flow & UX Journeys (USER_FLOW.md)**](docs/USER_FLOW.md)
  *Step-by-step user interaction diagrams for city search, 7-day day previewing, calendar synchronization (RFC 5545 .ics / Google Calendar), and ambient display mode.*

### Architecture & Data Engineering
- 🏛️ [**System Architecture (ARCHITECTURE.md)**](docs/ARCHITECTURE.md)
  *Unidirectional state architecture, custom hook composition, error boundary strategies, and 3-hour forecast grouping algorithms.*
- 📊 [**Data Model & Schemas (DATA_MODEL.md)**](docs/DATA_MODEL.md)
  *Entity-relationship diagrams (ERD), TypeScript interface definitions, timezone-shifting transformations, and offline hash-deterministic data generators.*
- 🚀 [**Engineering Plan & Roadmap (ENG_PLAN.md)**](docs/ENG_PLAN.md)
  *Component decomposition trees, completed architectural milestones (v1.0.0 through v2.3.0), and forward-looking production roadmap.*

### Quality, APIs & Setup
- 🧪 [**Test-Driven Development Specification (TDD.md)**](docs/TDD.md)
  *Vitest testing pyramid, unit test suites (conversions, timezone aggregations, search history), component test suites, and continuous integration commands.*
- 🌐 [**API Integration Reference (API_INTEGRATION.md)**](docs/API_INTEGRATION.md)
  *OpenWeather direct & reverse geocoding, current weather, 5-day forecasts, rate limiting policies, and HTTP error resolution matrix.*
- 🛠️ [**Developer Workstation Setup Guide (SETUP_GUIDE.md)**](docs/SETUP_GUIDE.md)
  *Step-by-step developer onboarding, environment variable configuration, local dev server execution, test commands, and troubleshooting FAQ.*

| Document | Category | Scope & Core Responsibility |
|---|---|---|
| [**PRD.md**](docs/PRD.md) | Product | Requirements, user stories, acceptance criteria & real-time nature landscape logic |
| [**DESIGN_BRIEF.md**](docs/DESIGN_BRIEF.md) | UI/UX | Glassmorphism design tokens, typography, color palettes & accessibility (WCAG AA) |
| [**USER_FLOW.md**](docs/USER_FLOW.md) | UX | ASCII interaction flows for search, 7-day preview, calendar sync & landscape display |
| [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) | Architecture | State management, data pipelines, error boundaries & responsive layout strategies |
| [**DATA_MODEL.md**](docs/DATA_MODEL.md) | Data & Types | Complete TypeScript interface schemas, timezone transformations & hash engine |
| [**ENG_PLAN.md**](docs/ENG_PLAN.md) | Engineering | Component hierarchy tree, milestones history & future release roadmap |
| [**TDD.md**](docs/TDD.md) | Testing & QA | Vitest testing pyramid, unit/integration test coverage & CI validation |
| [**API_INTEGRATION.md**](docs/API_INTEGRATION.md) | Integrations | OpenWeather endpoints, payload contracts, HTTP handling & fallback mock engine |
| [**SETUP_GUIDE.md**](docs/SETUP_GUIDE.md) | Dev Workflow | Local installation, environment configuration, scripts & troubleshooting guide |

---

## 🌟 Key Application Features

### 1. Dynamic Weather Station (`SmartStation`)
- **Real-Time Location Synchronization**: Searching any location immediately adjusts the digital station clock, destination calendar date, astronomical sunrise/sunset times, and multi-sensor readings to the destination's exact timezone offset (`current.timezoneOffset`).
- **Microclimate Climate Sensors**:
  - *Station Office Sensor*: Indoor temperature, relative humidity, and real-time CO₂ status indicators.
  - *Living Room Sensor*: Microclimate tracking with 24-hour differential trend indicators.
  - *Outdoor Sensor*: Live ambient outdoor readings with localized climate evaluations (*Fresh, Comfortable, Warm*).
- **Recent Searches Scroll Bar**: Horizontally scrollable chip list with smooth click-based scroll controls and `localStorage` persistence.
- **Center Meteorological Previews**:
  - *Rain Radar*: Live precipitation radar graphic with an interactive expandable modal.
  - *City Skyline Outlook*: HD panoramic skyline view with expand-to-webcam view.
  - *Sun & Wind Barometers*: Sunrise/sunset times and hectopascal (hPa) atmospheric pressure.

### 2. Location-Aware Real-Time Nature Landscapes (Display Mode)
- **Real-Time Procedural Nature Panorama Generator (`generateLocationNatureLandscape`)**:
  - Automatically synthesizes an atmospheric panoramic landscape reflecting the searched location's geography, current climate conditions, and destination local solar time.
  - **Solar Time Calculation**: Computes local destination hour from `current.timezoneOffset` to dynamically choose day/twilight/night palettes:
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
- **Global Curated Landscapes**: Swiss Alps Peak Sunset, Misty Nordic Fjord, Pacific Redwood Coast, and Kyoto Autumn Canopy.
- **Display Controls**: 6-second auto-advancing slideshow with Play / Pause controls, thumbnail strip, and an edge-to-edge Full Display theater mode.

### 3. 7-Day Monday to Sunday Weekly Forecast Strip
- **Chronological Sequence**: Fully represents the complete calendar week from Monday to Sunday (`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`).
- **Interactive Day Preview**: Clicking any day card (e.g. Wednesday or Saturday) immediately updates the dashboard to preview that day's temperatures, conditions, and sensor parameters.
- **Instant Reset**: Clear **`Reset to Today ↺`** action restores live real-time conditions.

### 4. Native Calendar Sync (RFC 5545 & Google Calendar API)
- **Universal iCalendar (.ics) Export**: One-click export generates RFC 5545 `.ics` files client-side, enabling full-week forecast import into Apple Calendar, Microsoft Outlook, and Google Calendar.
- **Google Calendar Direct Intent Web API**: One-click links pre-populate Google Calendar with all-day weather events, highs, lows, humidity, and wind notes for any selected forecast day.

### 5. Human-Figure Visual Icons
Atmospheric conditions are visualized through human figures tailored to real-time climate conditions:
- ☔ **Rain / Drizzle**: Person holding an umbrella in a raincoat.
- ⚡ **Thunderstorm**: Person running under an umbrella in stormy conditions.
- 🕶️ **Clear / Sunny Day**: Person wearing sunglasses and a wide summer brim hat.
- 🌙 **Clear Night**: Person stargazing at the crescent moon.
- 🧣 **Snow / Freezing**: Person bundled in a winter puffer coat, wool scarf, and pom-pom beanie.
- 🏮 **Fog / Mist**: Person walking with a warm illuminated lantern.
- 🚶 **Cloudy / Breezy**: Person walking comfortably in a windbreaker jacket.

---

## 🛠️ Technology Stack & Dependencies

| Layer | Package / Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.0.0` | UI component architecture and state management |
| **Language** | TypeScript | `~5.9.0` | Strict type safety, interfaces, and compile-time validation |
| **Bundler / Dev Server** | Vite | `^6.0.0` | Fast local development, sub-second HMR, and tree-shaking |
| **Styling** | Tailwind CSS | `^4.0.0` | Modern CSS tokens, zero-runtime overhead, glassmorphism |
| **Icons** | Lucide React | `^1.16.0` | Scalable interface icons for controls and navigation |
| **Test Runner** | Vitest | `^5.0.5` | Fast unit and integration test runner with DOM emulation |
| **Testing Utilities** | React Testing Library | `^16.0.0` | User-centric component testing and accessibility assertions |

---

## 📂 Source Code Structure

```
weather-dashboard/
├── docs/                            # Complete technical & product documentation
│   ├── API_INTEGRATION.md           # OpenWeather API integration and security
│   ├── ARCHITECTURE.md              # System architecture and state pipelines
│   ├── DATA_MODEL.md                # TypeScript models and schemas
│   ├── DESIGN_BRIEF.md              # Glassmorphism design tokens & typography
│   ├── ENG_PLAN.md                  # Engineering implementation roadmap
│   ├── PRD.md                       # Product Requirements Document
│   ├── SETUP_GUIDE.md               # Developer setup and troubleshooting
│   ├── TDD.md                       # Test-Driven Development specification
│   └── USER_FLOW.md                 # User journeys and decision trees
├── src/
│   ├── __tests__/                   # Vitest automated test suites (22 tests)
│   │   ├── App.test.tsx             # Complete dashboard integration tests
│   │   ├── SearchBar.test.tsx       # Search form validation tests
│   │   ├── forecastUtils.test.ts    # 5-day calendar grouping & min/max tests
│   │   ├── temperatureUtils.test.ts # Math & unit conversion tests
│   │   └── useRecentSearches.test.ts# Storage & deduplication tests
│   ├── components/                  # Focused, reusable React components
│   │   ├── CurrentWeather.tsx       # Standard 2-column hero weather view
│   │   ├── DashboardSkeleton.tsx    # Accessible shimmer skeleton loader
│   │   ├── ErrorMessage.tsx         # Contextual error card with retry action
│   │   ├── Forecast.tsx             # 7-day Monday to Sunday forecast strip
│   │   ├── ForecastCard.tsx         # Individual daily forecast card
│   │   ├── Header.tsx               # Branding logo, unit toggle & dark mode switch
│   │   ├── SearchBar.tsx            # City input form & geolocation button
│   │   ├── SmartStation.tsx         # Weather Station, real-time landscapes, calendar
│   │   ├── WeatherDetails.tsx       # Supplementary meteorological cards
│   │   └── WeatherIcon.tsx          # Human-figure visual weather icons
│   ├── hooks/                       # Custom state and persistence hooks
│   │   ├── useGeolocation.ts        # Browser navigator.geolocation handler
│   │   ├── useRecentSearches.ts     # LocalStorage recent searches manager
│   │   ├── useTheme.ts              # Theme persistence & classList synchronization
│   │   └── useWeather.ts            # Weather state, cancellation & actions
│   ├── services/                    # API communication layer
│   │   ├── apiClient.ts             # Typed HTTP client & error handler
│   │   ├── mockWeatherData.ts       # Deterministic zero-config offline weather engine
│   │   └── weatherService.ts        # Geocoding & weather query coordinator
│   ├── types/                       # TypeScript interfaces
│   │   └── weather.ts               # API models and application domain types
│   ├── utils/                       # Pure utility functions
│   │   ├── calendarUtils.ts         # Monday-to-Sunday week generator & .ics exporter
│   │   ├── forecastUtils.ts         # Calendar day aggregation algorithms
│   │   └── temperatureUtils.ts      # Math conversions and formatting
│   ├── App.tsx                      # Root application layout and orchestration
│   ├── index.css                    # Tailwind CSS imports and base styles
│   ├── main.tsx                     # React 19 entrypoint
│   └── vite-env.d.ts                # Environment variable type declarations
├── .env.example                     # Environment template (safe for git)
├── .gitignore                       # Excludes .env, node_modules, and dist
├── index.html                       # HTML5 root with SEO meta tags
├── package.json                     # Project manifest and scripts
├── tsconfig.json                    # TypeScript compiler options
├── vite.config.ts                   # Vite, Tailwind, and Vitest configuration
└── vitest.setup.ts                  # Testing Library setup
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/maheswari-pinnetii/weather-dashboard.git
cd weather-dashboard
npm install
```

### 3. API Key Setup
1. Register for a free OpenWeather API key at [openweathermap.org/api](https://openweathermap.org/api).
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and paste your key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

> **Zero-Config Offline Support**: If an API key is not supplied, the application automatically activates its deterministic mock engine, enabling complete exploration of all features, cities, landscapes, and calendar tools offline.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🧪 Testing & Production Build

### Run Automated Tests
Execute the full Vitest suite (22 tests across 5 test suites):
```bash
npm test -- --run
```

### Run Tests in Watch Mode
```bash
npm test
```

### Run TypeScript Verification & Production Build
```bash
npm run build
```
The compiled, optimized production bundle will be generated in `dist/`.

---

## 📡 API Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `https://api.openweathermap.org/geo/1.0/direct` | `GET` | Resolves city names to latitude and longitude coordinates |
| `https://api.openweathermap.org/geo/1.0/reverse` | `GET` | Resolves GPS coordinates to readable city names |
| `https://api.openweathermap.org/data/2.5/weather` | `GET` | Fetches real-time current weather conditions |
| `https://api.openweathermap.org/data/2.5/forecast` | `GET` | Fetches 5-day forecast data in 3-hour intervals |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
