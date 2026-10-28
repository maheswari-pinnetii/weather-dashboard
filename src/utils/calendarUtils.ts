/**
 * Calendar Integration & 7-Day Forecast Helpers
 * 
 * Provides:
 * 1. 7-Day Monday-to-Sunday calculation and event generation.
 * 2. iCalendar (.ics) export standard (RFC 5545) compatible with Apple Calendar, Outlook, and Google Calendar.
 * 3. Direct Google Calendar Web API link generator.
 */

import { DailyForecast, TemperatureUnit } from '../types/weather';
import { formatTemperature } from './temperatureUtils';

export interface CalendarDayInfo {
  dateKey: string;           // YYYY-MM-DD
  dayName: string;           // Mon, Tue, Wed, etc.
  dayNumber: number;         // 1-31
  isToday: boolean;
  forecast?: DailyForecast;  // Weather data matching this date
}

/**
 * Returns the 7 days of the current week from Monday to Sunday.
 */
export function getMondayToSundayWeek(referenceDate: Date = new Date()): CalendarDayInfo[] {
  const current = new Date(referenceDate);
  const currentDayOfWeek = current.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
  // Calculate offset to Monday (1)
  // If today is Sunday (0), distance to preceding Monday is -6 days. Otherwise, 1 - currentDayOfWeek.
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + distanceToMonday);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDays: CalendarDayInfo[] = [];

  const todayStr = current.toISOString().slice(0, 10);

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);

    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const dateNum = String(day.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${dateNum}`;

    weekDays.push({
      dateKey,
      dayName: dayNames[i],
      dayNumber: day.getDate(),
      isToday: dateKey === todayStr,
    });
  }

  return weekDays;
}

/**
 * Generates an RFC 5545 standard .ics (iCalendar) file and triggers download.
 * Compatible with Apple Calendar, Google Calendar, Outlook, Thunderbird.
 */
export function downloadCalendarIcs(
  cityName: string,
  forecasts: DailyForecast[],
  unit: TemperatureUnit
): void {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Weather Dashboard//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${cityName} Weather Forecast`,
  ];

  forecasts.forEach((f) => {
    const [y, m, d] = f.date.split('-').map(Number);
    const startStr = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    
    // Day after for all-day event end
    const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
    const endStr = `${nextDay.getUTCFullYear()}${String(nextDay.getUTCMonth() + 1).padStart(2, '0')}${String(nextDay.getUTCDate()).padStart(2, '0')}`;

    const summary = `${f.weather.main} (${formatTemperature(f.tempMax, unit)} / ${formatTemperature(f.tempMin, unit)}) in ${cityName}`;
    const description = `Expected condition: ${f.weather.description}. High: ${formatTemperature(f.tempMax, unit)}, Low: ${formatTemperature(f.tempMin, unit)}. Humidity: ${f.avgHumidity}%, Wind: ${f.avgWindSpeed} m/s.`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${f.date}-${cityName.toLowerCase()}-weather@dashboard`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${startStr}`,
      `DTEND;VALUE=DATE:${endStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${cityName}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${cityName.toLowerCase()}-weather-forecast.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a Google Calendar Web API intent URL for adding a weather event to Google Calendar.
 */
export function getGoogleCalendarUrl(
  cityName: string,
  forecast: DailyForecast,
  unit: TemperatureUnit
): string {
  const [y, m, d] = forecast.date.split('-').map(Number);
  const startStr = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
  const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
  const endStr = `${nextDay.getUTCFullYear()}${String(nextDay.getUTCMonth() + 1).padStart(2, '0')}${String(nextDay.getUTCDate()).padStart(2, '0')}`;

  const title = encodeURIComponent(`${cityName} Weather: ${forecast.weather.description} (${formatTemperature(forecast.tempMax, unit)})`);
  const details = encodeURIComponent(
    `Forecast for ${forecast.dayName}, ${forecast.date} in ${cityName}.\nHigh: ${formatTemperature(forecast.tempMax, unit)}\nLow: ${formatTemperature(forecast.tempMin, unit)}\nHumidity: ${forecast.avgHumidity}%\nWind: ${forecast.avgWindSpeed} m/s`
  );
  const location = encodeURIComponent(cityName);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}
