# OpenWeather API Integration Guide

This document explains the integration between the Weather Dashboard and the **OpenWeather API**, covering endpoints, error classification, configuration, and security best practices.

---

## 1. Endpoints

The application consumes four official OpenWeather API endpoints via `src/services/weatherService.ts`:

### 1.1 Direct Geocoding API
- **Endpoint**: `GET https://api.openweathermap.org/geo/1.0/direct`
- **Query Parameters**:
  - `q`: Target city name (e.g. `London` or `London,GB`)
  - `limit`: `1`
  - `appid`: OpenWeather API Key
- **Response**: Array of geocoding coordinates (`lat`, `lon`, `name`, `country`, `state`).

### 1.2 Reverse Geocoding API
- **Endpoint**: `GET https://api.openweathermap.org/geo/1.0/reverse`
- **Query Parameters**:
  - `lat`: GPS Latitude
  - `lon`: GPS Longitude
  - `limit`: `1`
  - `appid`: OpenWeather API Key
- **Purpose**: Converts GPS device coordinates into readable city and country names when users select **"Use My Location"**.

### 1.3 Current Weather API
- **Endpoint**: `GET https://api.openweathermap.org/data/2.5/weather`
- **Query Parameters**:
  - `lat`: Latitude
  - `lon`: Longitude
  - `units`: `metric`
  - `appid`: OpenWeather API Key
- **Response**: Live temperature, feels-like temperature, humidity, pressure, wind speed, visibility, and weather condition codes.

### 1.4 5-Day / 3-Hour Forecast API
- **Endpoint**: `GET https://api.openweathermap.org/data/2.5/forecast`
- **Query Parameters**:
  - `lat`: Latitude
  - `lon`: Longitude
  - `units`: `metric`
  - `appid`: OpenWeather API Key
- **Response**: 40 records spaced at 3-hour intervals, aggregated into 5 calendar days by `forecastUtils.ts`.

---

## 2. API Key Configuration

1. Create a free account at [openweathermap.org](https://openweathermap.org/).
2. Navigate to your **API Keys** tab and generate an API key.
3. In the project root, duplicate `.env.example` to create `.env`:
   ```bash
   cp .env.example .env
   ```
4. Enter your key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

---

## 3. Error Handling and Domain Codes

All non-2xx responses are parsed and converted into typed `WeatherApiError` instances:

| HTTP Status | Domain Error Code | Description / User Guidance |
|---|---|---|
| `401` (Unconfigured) | `MISSING_API_KEY` | Prompt to add key to `.env` |
| `401` (Invalid key) | `UNAUTHORIZED` | Warns that key is invalid or pending activation |
| `404` | `CITY_NOT_FOUND` | City could not be located; prompts spelling check |
| `429` | `RATE_LIMIT` | OpenWeather rate limit reached; prompts retry |
| `0` | `NETWORK_ERROR` | Offline or network connection timeout |

---

## 4. Production Security Notice

- Vite bundles variables prefixed with `VITE_` directly into client-side JavaScript.
- Anyone inspecting network requests can view client-embedded keys.
- **Production Recommendation**: Route client calls through a lightweight backend proxy (e.g. Express, Next.js API Routes, or Cloudflare Workers) that appends the API key server-side.
