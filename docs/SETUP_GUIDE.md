# Developer and Setup Guide

This guide covers local development, testing workflows, production builds, and troubleshooting procedures for the Weather Dashboard.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

---

## 2. Installation and Local Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/maheswari-pinnetii/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Add your OpenWeather API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://localhost:5173/`.

---

## 3. Testing Workflows

The test suite uses **Vitest** and **React Testing Library**:

- **Run All Tests Once**:
  ```bash
  npm test
  ```
- **Run in Watch Mode**:
  ```bash
  npm run test:watch
  ```

### Test Coverage Summary
- `temperatureUtils.test.ts`: Formula accuracy ($F = C \times \frac{9}{5} + 32$), boundary conditions, and wind speed conversions (`km/h` and `mph`).
- `forecastUtils.test.ts`: Calendar date grouping, high/low range calculations, representative condition selection, and 5-day boundary capping.
- `useRecentSearches.test.ts`: LocalStorage persistence, 5-item cap, and case-insensitive deduplication.
- `SearchBar.test.tsx`: Empty input rejection, whitespace trimming, and geolocation button triggers.
- `App.test.tsx`: End-to-end integration covering initial load, loading skeletons, weather rendering, error states, and dark mode toggles.

---

## 4. Production Build and Verification

Generate a production-optimized build:
```bash
npm run build
```
This runs TypeScript type checking (`tsc`) followed by the Vite bundler. Output is written to the `dist/` directory.

To preview the built production bundle locally:
```bash
npm run preview
```

---

## 5. Troubleshooting Common Issues

### Issue: "Invalid or unauthorized API key" (401)
- Newly created OpenWeather API keys can take between 10 minutes to 2 hours to activate globally.
- Verify that `.env` contains the correct key without quotes or trailing spaces.
- Restart the Vite dev server (`npm run dev`) after modifying `.env`.

### Issue: "City Not Found" (404)
- Include the ISO two-letter country code for precision (e.g. `Paris, FR` or `Cambridge, US`).

### Issue: Geolocation Denied
- Ensure location permissions are granted in your browser settings for `http://localhost:5173/`.
