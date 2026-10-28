/**
 * Formats a Unix timestamp with a timezone offset into a calendar date string: "Tuesday, Apr 29, 2025"
 */
export function formatHeaderDate(timestamp: number, timezoneOffsetSeconds = 0): string {
  const localDate = new Date((timestamp + timezoneOffsetSeconds) * 1000);
  return localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Formats a YYYY-MM-DD date string into short format: "Apr 29"
 */
export function formatShortDate(dateString: string): string {
  const [y, m, d] = dateString.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Formats a timestamp into local time: "1:45 PM"
 */
export function formatLocalTime(timestamp: number, timezoneOffsetSeconds = 0): string {
  const localDate = new Date((timestamp + timezoneOffsetSeconds) * 1000);
  return localDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}
