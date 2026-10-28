import { TemperatureUnit } from '../types/weather';

/**
 * Converts Celsius to Fahrenheit
 * Formula: F = C * 9/5 + 32
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Converts Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Formats a temperature given in Celsius according to the chosen unit.
 * Rounds to integer or one decimal place if specified.
 */
export function formatTemperature(
  tempCelsius: number,
  unit: TemperatureUnit,
  includeUnitSymbol = true,
  decimals = 0
): string {
  if (tempCelsius === null || tempCelsius === undefined || isNaN(tempCelsius)) {
    return '--';
  }

  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(tempCelsius) : tempCelsius;
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  if (!includeUnitSymbol) {
    return rounded;
  }

  return `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

/**
 * Formats wind speed. Returns km/h for metric (standard dashboard display) and mph for imperial.
 */
export function formatWindSpeed(speedMps: number, unit: TemperatureUnit): string {
  if (speedMps === null || speedMps === undefined || isNaN(speedMps)) {
    return '--';
  }

  if (unit === 'fahrenheit') {
    // Convert m/s to mph: 1 m/s = 2.23694 mph
    const mph = Math.round(speedMps * 2.23694);
    return `${mph} mph`;
  }

  // Convert m/s to km/h: 1 m/s = 3.6 km/h
  const kmh = Math.round(speedMps * 3.6);
  return `${kmh} km/h`;
}
