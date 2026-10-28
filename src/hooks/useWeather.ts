import { useState, useRef, useCallback, useEffect } from 'react';
import {
  WeatherDashboardData,
  Coordinates,
} from '../types/weather';
import {
  getWeatherDataForCity,
  getWeatherDataForCoords,
  reverseGeocode,
  WeatherApiError,
} from '../services/weatherService';

export interface UseWeatherState {
  data: WeatherDashboardData | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  lastSearchedCity: string | null;
}

export function useWeather(onSearchSuccess?: (city: string, country?: string) => void) {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    isLoading: false,
    error: null,
    errorCode: null,
    lastSearchedCity: null,
  });

  // Track the active abort controller to cancel in-flight requests and prevent race conditions
  const activeAbortController = useRef<AbortController | null>(null);

  // Clean up any ongoing fetch on unmount
  useEffect(() => {
    return () => {
      if (activeAbortController.current) {
        activeAbortController.current.abort();
      }
    };
  }, []);

  const searchCity = useCallback(
    async (city: string) => {
      const trimmed = city.trim();
      if (!trimmed) {
        setState((prev) => ({
          ...prev,
          error: 'Please enter a city name to search.',
          errorCode: 'EMPTY_INPUT',
        }));
        return;
      }

      // Abort previous in-flight request if any
      if (activeAbortController.current) {
        activeAbortController.current.abort();
      }

      const controller = new AbortController();
      activeAbortController.current = controller;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        errorCode: null,
      }));

      try {
        const result = await getWeatherDataForCity(trimmed, controller.signal);

        // Success - update state and save to recent searches
        setState({
          data: result,
          isLoading: false,
          error: null,
          errorCode: null,
          lastSearchedCity: trimmed,
        });

        if (onSearchSuccess) {
          onSearchSuccess(result.current.cityName, result.current.country);
        }
      } catch (err: unknown) {
        // Ignore aborted requests
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        const message =
          err instanceof WeatherApiError
            ? err.message
            : err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching weather data.';

        const code = err instanceof WeatherApiError ? err.code || 'UNKNOWN_ERROR' : 'UNKNOWN_ERROR';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
          errorCode: code,
          // Preserve existing data so UI doesn't completely disappear on a failed quick search,
          // but display the error overlay/message clearly
        }));
      } finally {
        if (activeAbortController.current === controller) {
          activeAbortController.current = null;
        }
      }
    },
    [onSearchSuccess]
  );

  const fetchByCoordinates = useCallback(
    async (coords: Coordinates) => {
      if (activeAbortController.current) {
        activeAbortController.current.abort();
      }

      const controller = new AbortController();
      activeAbortController.current = controller;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        errorCode: null,
      }));

      try {
        // Attempt reverse geocoding to retrieve readable city and country names
        const geoInfo = await reverseGeocode(coords, controller.signal);

        const result = await getWeatherDataForCoords(
          coords,
          geoInfo
            ? { cityName: geoInfo.name, country: geoInfo.country, state: geoInfo.state }
            : undefined,
          controller.signal
        );

        setState({
          data: result,
          isLoading: false,
          error: null,
          errorCode: null,
          lastSearchedCity: result.current.cityName,
        });

        if (onSearchSuccess) {
          onSearchSuccess(result.current.cityName, result.current.country);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        const message =
          err instanceof WeatherApiError
            ? err.message
            : err instanceof Error
            ? err.message
            : 'Unable to retrieve weather for your coordinates.';

        const code = err instanceof WeatherApiError ? err.code || 'UNKNOWN_ERROR' : 'UNKNOWN_ERROR';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
          errorCode: code,
        }));
      } finally {
        if (activeAbortController.current === controller) {
          activeAbortController.current = null;
        }
      }
    },
    [onSearchSuccess]
  );

  const retryLastSearch = useCallback(() => {
    if (state.lastSearchedCity) {
      searchCity(state.lastSearchedCity);
    }
  }, [searchCity, state.lastSearchedCity]);

  return {
    weatherData: state.data,
    isLoading: state.isLoading,
    error: state.error,
    errorCode: state.errorCode,
    lastSearchedCity: state.lastSearchedCity,
    searchCity,
    fetchByCoordinates,
    retryLastSearch,
  };
}
