import { ForecastItem, DailyForecast, WeatherCondition } from '../types/weather';

/**
 * Groups 3-hour forecast items into daily summaries for 5 consecutive days.
 * 
 * OpenWeather 5-day / 3-hour endpoint returns up to 40 items.
 * We calculate the destination's local calendar date using timezoneOffset in seconds,
 * group entries by local date, find true min/max temperatures, select representative mid-day weather condition,
 * and calculate average humidity and precipitation probabilities.
 */
export function groupForecastByDay(
  forecastList: ForecastItem[],
  timezoneOffsetSeconds = 0
): DailyForecast[] {
  if (!forecastList || forecastList.length === 0) {
    return [];
  }

  // Map to hold entries by local date string (YYYY-MM-DD)
  const daysMap = new Map<string, ForecastItem[]>();

  forecastList.forEach((item) => {
    // Shift item timestamp by destination timezone offset to obtain destination's local calendar date
    const localTimestamp = (item.dt + timezoneOffsetSeconds) * 1000;
    const localDate = new Date(localTimestamp);
    // Format YYYY-MM-DD using UTC methods because we manually adjusted the epoch
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    if (!daysMap.has(dateKey)) {
      daysMap.set(dateKey, []);
    }
    daysMap.get(dateKey)!.push(item);
  });

  const dailySummaries: DailyForecast[] = [];

  // Sort dates chronologically
  const sortedDates = Array.from(daysMap.keys()).sort();

  for (const dateKey of sortedDates) {
    const items = daysMap.get(dateKey)!;
    if (items.length === 0) continue;

    // Calculate minimum and maximum temperatures across all entries for this calendar day
    let tempMin = Infinity;
    let tempMax = -Infinity;
    let totalHumidity = 0;
    let totalWindSpeed = 0;
    let maxPop = 0;

    items.forEach((item) => {
      const minVal = item.main.temp_min !== undefined ? item.main.temp_min : item.main.temp;
      const maxVal = item.main.temp_max !== undefined ? item.main.temp_max : item.main.temp;
      if (minVal < tempMin) tempMin = minVal;
      if (maxVal > tempMax) tempMax = maxVal;
      totalHumidity += item.main.humidity;
      totalWindSpeed += item.wind.speed;
      if (item.pop > maxPop) maxPop = item.pop;
    });

    const avgHumidity = Math.round(totalHumidity / items.length);
    const avgWindSpeed = Number((totalWindSpeed / items.length).toFixed(1));

    // Choose representative weather condition:
    // Prefer midday slot (around 12:00:00 to 15:00:00 local time) if available, otherwise middle item
    let representativeWeather: WeatherCondition = items[0].weather[0];
    
    // Check for an item closest to 12:00 - 15:00 local time
    const middayItem = items.find((item) => {
      const localTime = new Date((item.dt + timezoneOffsetSeconds) * 1000);
      const hours = localTime.getUTCHours();
      return hours >= 11 && hours <= 15;
    });

    if (middayItem && middayItem.weather && middayItem.weather.length > 0) {
      representativeWeather = middayItem.weather[0];
    } else {
      const midIdx = Math.floor(items.length / 2);
      if (items[midIdx] && items[midIdx].weather && items[midIdx].weather.length > 0) {
        representativeWeather = items[midIdx].weather[0];
      }
    }

    // Determine Day Name
    const [y, m, d] = dateKey.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    const dayName = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    });

    dailySummaries.push({
      date: dateKey,
      dayName,
      tempMin: Math.round(tempMin * 10) / 10,
      tempMax: Math.round(tempMax * 10) / 10,
      weather: representativeWeather,
      precipitationProbability: maxPop,
      avgHumidity,
      avgWindSpeed,
    });
  }

  // Return exactly 5 days (or up to 5 if fewer available)
  // If first day is today and only has 1 late evening record, 5 days can still span appropriately.
  return dailySummaries.slice(0, 5);
}
