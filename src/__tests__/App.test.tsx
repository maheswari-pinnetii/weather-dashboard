import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import App from '../App';
import * as weatherService from '../services/weatherService';
import { WeatherDashboardData } from '../types/weather';

const mockWeatherData: WeatherDashboardData = {
  current: {
    cityName: 'London',
    country: 'GB',
    coordinates: { lat: 51.51, lon: -0.13 },
    temperature: 20,
    feelsLike: 19,
    tempMin: 15,
    tempMax: 22,
    humidity: 65,
    pressure: 1012,
    visibility: 10000,
    windSpeed: 4.5,
    windDirection: 210,
    weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    timestamp: 1780272000,
    timezoneOffset: 3600,
  },
  forecast: [
    {
      date: '2026-06-01',
      dayName: 'Mon',
      tempMin: 14,
      tempMax: 23,
      weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
      precipitationProbability: 0.1,
      avgHumidity: 60,
      avgWindSpeed: 3.5,
    },
    {
      date: '2026-06-02',
      dayName: 'Tue',
      tempMin: 15,
      tempMax: 24,
      weather: { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
      precipitationProbability: 0.2,
      avgHumidity: 62,
      avgWindSpeed: 4.0,
    },
    {
      date: '2026-06-03',
      dayName: 'Wed',
      tempMin: 13,
      tempMax: 21,
      weather: { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
      precipitationProbability: 0.8,
      avgHumidity: 75,
      avgWindSpeed: 5.2,
    },
    {
      date: '2026-06-04',
      dayName: 'Thu',
      tempMin: 12,
      tempMax: 20,
      weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
      precipitationProbability: 0.0,
      avgHumidity: 55,
      avgWindSpeed: 3.8,
    },
    {
      date: '2026-06-05',
      dayName: 'Fri',
      tempMin: 14,
      tempMax: 22,
      weather: { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      precipitationProbability: 0.3,
      avgHumidity: 58,
      avgWindSpeed: 4.1,
    },
  ],
};

describe('App Dashboard Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial dashboard header and search bar correctly', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /weather dashboard/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search for a city/i)).toBeInTheDocument();
  });

  it('displays loading skeleton and weather dashboard data when city search succeeds', async () => {
    let resolvePromise: (val: WeatherDashboardData) => void;
    const promise = new Promise<WeatherDashboardData>((res) => {
      resolvePromise = res;
    });

    vi.spyOn(weatherService, 'getWeatherDataForCity').mockImplementation(() => promise);

    render(<App />);

    // Verify loading skeleton appears while initial search promise is pending
    expect(screen.getByTestId('current-weather-skeleton')).toBeInTheDocument();

    // Resolve the mock weather data
    await act(async () => {
      resolvePromise!(mockWeatherData);
    });

    // Verify successful render of London weather
    await waitFor(() => {
      expect(screen.getAllByRole('heading', { name: /London/i })[0]).toBeInTheDocument();
    });

    expect(screen.getByText(/20°C/i)).toBeInTheDocument();
    expect(screen.getAllByText(/clear sky/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText('65%')[0]).toBeInTheDocument();

    // Verify 5-day forecast heading and cards
    expect(screen.getByRole('heading', { name: /5-day forecast/i })).toBeInTheDocument();
    expect(screen.getAllByText('Mon')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Tue')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Wed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Thu')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Fri')[0]).toBeInTheDocument();
  });

  it('displays error message when city search fails', async () => {
    vi.spyOn(weatherService, 'getWeatherDataForCity').mockRejectedValue(
      new weatherService.WeatherApiError('City "Atlantis" could not be found.', 404, 'CITY_NOT_FOUND')
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/City "Atlantis" could not be found/i)).toBeInTheDocument();
  });

  it('converts temperature values when toggling between Celsius and Fahrenheit', async () => {
    vi.spyOn(weatherService, 'getWeatherDataForCity').mockResolvedValue(mockWeatherData);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/20°C/i)).toBeInTheDocument();
    });

    // Toggle unit to Fahrenheit
    const fahrenheitBtn = screen.getByRole('button', { name: '°F' });
    act(() => {
      fireEvent.click(fahrenheitBtn);
    });

    // 20 C = 68 F
    await waitFor(() => {
      expect(screen.getByText(/68°F/i)).toBeInTheDocument();
    });
  });

  it('toggles dark mode class on documentElement', () => {
    render(<App />);

    const themeBtn = screen.getByRole('button', { name: /switch to/i });
    const initialIsDark = document.documentElement.classList.contains('dark');

    act(() => {
      fireEvent.click(themeBtn);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(!initialIsDark);

    act(() => {
      fireEvent.click(themeBtn);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(initialIsDark);
  });
});
