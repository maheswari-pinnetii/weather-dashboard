const BASE_URL = 'https://api.openweathermap.org';

export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const DEFAULT_API_KEY = '899998496c3d1bfbdd5a786bf74ec66c';

/**
 * Checks whether a valid OpenWeather API key has been provided in .env or default key
 */
export function hasApiKey(): boolean {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || DEFAULT_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_api_key_here' && apiKey.trim() !== '');
}

/**
 * Checks and retrieves the configured OpenWeather API Key from environment variables or default.
 */
export function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || DEFAULT_API_KEY;
  if (!hasApiKey()) {
    throw new ApiError(
      'OpenWeather API key is not configured. Please add your key to .env as VITE_OPENWEATHER_API_KEY.',
      401,
      'MISSING_API_KEY'
    );
  }
  return apiKey.trim();
}

/**
 * HTTP request helper wrapping fetch with cancellation, JSON parsing, and unified error mapping.
 */
export async function apiRequest<T>(
  endpoint: string,
  params: Record<string, string | number>,
  signal?: AbortSignal
): Promise<T> {
  const apiKey = getApiKey();
  const queryParams = new URLSearchParams({
    ...Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {}),
    appid: apiKey,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError(
      'Network error. Please check your internet connection and try again.',
      0,
      'NETWORK_ERROR'
    );
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred while communicating with the weather service.';
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message.charAt(0).toUpperCase() + errorData.message.slice(1);
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    if (response.status === 401) {
      throw new ApiError(
        'Invalid or unauthorized API key. Please verify your OpenWeather API key.',
        401,
        'UNAUTHORIZED'
      );
    }

    if (response.status === 404) {
      throw new ApiError(
        'Location not found. Please verify the city name or spelling.',
        404,
        'NOT_FOUND'
      );
    }

    if (response.status === 429) {
      throw new ApiError(
        'API rate limit exceeded. Please wait a few moments and try again.',
        429,
        'RATE_LIMIT'
      );
    }

    throw new ApiError(errorMessage, response.status, 'API_ERROR');
  }

  return response.json();
}
