import { describe, it, expect } from 'vitest';
import { groupForecastByDay } from '../utils/forecastUtils';
import { ForecastItem } from '../types/weather';

function makeMockItem(
  dt: number,
  tempMin: number,
  tempMax: number,
  humidity: number,
  windSpeed: number,
  pop: number,
  icon = '01d',
  main = 'Clear',
  desc = 'clear sky'
): ForecastItem {
  return {
    dt,
    dt_txt: new Date(dt * 1000).toISOString(),
    main: {
      temp: (tempMin + tempMax) / 2,
      feels_like: (tempMin + tempMax) / 2,
      temp_min: tempMin,
      temp_max: tempMax,
      pressure: 1013,
      humidity,
    },
    weather: [
      {
        id: 800,
        main,
        description: desc,
        icon,
      },
    ],
    clouds: { all: 0 },
    wind: { speed: windSpeed, deg: 180 },
    visibility: 10000,
    pop,
  };
}

describe('Forecast Grouping Utilities', () => {
  it('returns empty array when forecast list is empty', () => {
    expect(groupForecastByDay([])).toEqual([]);
  });

  it('groups 3-hour interval records into daily summaries and computes min and max temps correctly', () => {
    // 2 days of mock data
    // Day 1: 2026-06-01 (epoch 1780272000 is 2026-06-01 00:00:00 UTC)
    const baseDay1 = 1780272000;
    const items: ForecastItem[] = [
      makeMockItem(baseDay1 + 3600 * 3, 15, 18, 70, 3.2, 0.1),
      makeMockItem(baseDay1 + 3600 * 6, 12, 20, 65, 4.0, 0.2), // lowest min = 12
      makeMockItem(baseDay1 + 3600 * 12, 20, 26, 50, 5.0, 0.0, '01d', 'Clear', 'sunny day'), // highest max = 26
      makeMockItem(baseDay1 + 3600 * 18, 16, 22, 60, 3.5, 0.1),

      // Day 2: 2026-06-02 (baseDay1 + 86400)
      makeMockItem(baseDay1 + 86400 + 3600 * 3, 14, 17, 80, 2.0, 0.4),
      makeMockItem(baseDay1 + 86400 + 3600 * 12, 19, 23, 75, 4.5, 0.7, '10d', 'Rain', 'light rain'),
    ];

    const result = groupForecastByDay(items, 0);

    expect(result.length).toBe(2);

    // Day 1 validation
    expect(result[0].date).toBe('2026-06-01');
    expect(result[0].tempMin).toBe(12);
    expect(result[0].tempMax).toBe(26);
    expect(result[0].weather.description).toBe('sunny day'); // picked midday 12:00
    expect(result[0].precipitationProbability).toBe(0.2);

    // Day 2 validation
    expect(result[1].date).toBe('2026-06-02');
    expect(result[1].tempMin).toBe(14);
    expect(result[1].tempMax).toBe(23);
    expect(result[1].precipitationProbability).toBe(0.7);
  });

  it('limits result to 5 days maximum', () => {
    const baseEpoch = 1780272000;
    const items: ForecastItem[] = [];

    // Create 7 distinct days
    for (let day = 0; day < 7; day++) {
      items.push(makeMockItem(baseEpoch + day * 86400 + 3600 * 12, 15, 25, 50, 3.0, 0.1));
    }

    const result = groupForecastByDay(items, 0);
    expect(result.length).toBe(5);
  });
});
