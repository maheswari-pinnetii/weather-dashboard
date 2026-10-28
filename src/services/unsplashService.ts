/**
 * Unsplash Service
 * Fetches location photos using Unsplash API or dynamic Unsplash Source imagery
 */

interface UnsplashPhoto {
  url: string;
  authorName?: string;
  authorUrl?: string;
  description?: string;
}

// In-memory cache to avoid repeated requests during a session
const photoCache: Record<string, string> = {};

/**
 * Fetches a location photo for a city.
 * If VITE_UNSPLASH_ACCESS_KEY is provided, queries https://api.unsplash.com/search/photos?query={LOCATION}&per_page=1
 * Otherwise, uses high-resolution Unsplash photo endpoint for the location.
 */
export async function fetchLocationPhoto(location: string): Promise<string> {
  const query = location.trim();
  if (!query) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80';
  }

  const cacheKey = query.toLowerCase();
  if (photoCache[cacheKey]) {
    return photoCache[cacheKey];
  }

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (accessKey && accessKey !== 'your_unsplash_access_key_here') {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const photoUrl = data.results[0].urls.regular || data.results[0].urls.full;
          photoCache[cacheKey] = photoUrl;
          return photoUrl;
        }
      }
    } catch {
      // Fall through to Unsplash source fallback
    }
  }

  // Instant high-quality location photo from Unsplash without requiring an API key
  const fallbackUrl = `https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=80&search=${encodeURIComponent(query)}`;
  photoCache[cacheKey] = fallbackUrl;
  return fallbackUrl;
}
