import { describe, it, expect } from 'vitest';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatTemperature,
  formatWindSpeed,
} from '../utils/temperatureUtils';

describe('Temperature Conversion Utilities', () => {
  it('converts Celsius to Fahrenheit accurately with F = C * 9/5 + 32', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(25)).toBe(77);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it('converts Fahrenheit to Celsius accurately', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(fahrenheitToCelsius(77)).toBe(25);
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });

  it('formats temperature with Celsius symbol', () => {
    expect(formatTemperature(23.4, 'celsius')).toBe('23°C');
    expect(formatTemperature(23.6, 'celsius')).toBe('24°C');
    expect(formatTemperature(23.4, 'celsius', false)).toBe('23');
  });

  it('formats temperature converted to Fahrenheit', () => {
    // 25 C = 77 F
    expect(formatTemperature(25, 'fahrenheit')).toBe('77°F');
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°F');
  });

  it('formats wind speed in km/h and mph', () => {
    // 10 m/s * 3.6 = 36 km/h
    expect(formatWindSpeed(10, 'celsius')).toBe('36 km/h');
    // 10 m/s * 2.23694 = 22 mph
    expect(formatWindSpeed(10, 'fahrenheit')).toBe('22 mph');
  });
});
