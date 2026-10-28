import { useState, useCallback } from 'react';
import { Coordinates } from '../types/weather';

export interface UseGeolocationReturn {
  coords: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  getLocation: (onSuccess: (coords: Coordinates) => void) => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const getLocation = useCallback((onSuccess: (coords: Coordinates) => void) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setErrorCode('NOT_SUPPORTED');
      return;
    }

    setError(null);
    setErrorCode(null);
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoading(false);
        const userCoords: Coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCoords(userCoords);
        onSuccess(userCoords);
      },
      (geoError) => {
        setIsLoading(false);
        let msg = 'Unable to retrieve your location.';
        let code = 'GEOLOCATION_ERROR';

        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or search for a city manually.';
          code = 'GEOLOCATION_DENIED';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
          code = 'POSITION_UNAVAILABLE';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
          code = 'TIMEOUT';
        }

        setError(msg);
        setErrorCode(code);
      },
      {
        timeout: 10000,
        maximumAge: 60000,
        enableHighAccuracy: false,
      }
    );
  }, []);

  return {
    coords,
    isLoading,
    error,
    errorCode,
    getLocation,
  };
}
