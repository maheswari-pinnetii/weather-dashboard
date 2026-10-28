import { useState, useCallback } from 'react';
import { TemperatureUnit } from '../types/weather';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatTemperature as formatTempUtil,
  formatWindSpeed as formatWindUtil,
} from '../utils/temperatureUtils';

const TEMP_UNIT_STORAGE_KEY = 'weather_dashboard_unit';

export function useTemperature() {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem(TEMP_UNIT_STORAGE_KEY);
      if (saved === 'celsius' || saved === 'fahrenheit') return saved;
    } catch {
      // ignore in restricted browser contexts
    }
    return 'celsius';
  });

  const setUnit = useCallback((newUnit: TemperatureUnit) => {
    setUnitState(newUnit);
    try {
      localStorage.setItem(TEMP_UNIT_STORAGE_KEY, newUnit);
    } catch {
      // ignore in restricted browser contexts
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  }, [unit, setUnit]);

  const formatTemperature = useCallback(
    (tempCelsius: number, includeUnitSymbol = true, decimals = 0) => {
      return formatTempUtil(tempCelsius, unit, includeUnitSymbol, decimals);
    },
    [unit]
  );

  const formatWindSpeed = useCallback(
    (speedMps: number) => {
      return formatWindUtil(speedMps, unit);
    },
    [unit]
  );

  return {
    unit,
    setUnit,
    toggleUnit,
    formatTemperature,
    formatWindSpeed,
    celsiusToFahrenheit,
    fahrenheitToCelsius,
  };
}
