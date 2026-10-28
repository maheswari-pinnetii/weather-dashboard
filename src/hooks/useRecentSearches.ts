import { useState, useCallback } from 'react';

const RECENT_SEARCHES_KEY = 'weather_dashboard_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export interface RecentSearchItem {
  id: string;
  name: string;
  country?: string;
  timestamp: number;
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENT_SEARCHES);
        }
      }
    } catch (e) {
      console.warn('Failed to parse recent searches from localStorage', e);
    }
    return [];
  });

  const addSearch = useCallback((name: string, country?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      // Avoid case-insensitive duplicates
      const filtered = prev.filter(
        (item) => item.name.toLowerCase() !== trimmed.toLowerCase()
      );

      const newItem: RecentSearchItem = {
        id: `${trimmed.toLowerCase()}-${Date.now()}`,
        name: trimmed,
        country,
        timestamp: Date.now(),
      };

      const updated = [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist recent searches to localStorage', err);
      }

      return updated;
    });
  }, []);

  const removeSearch = useCallback((id: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist updated recent searches to localStorage', err);
      }
      return updated;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.warn('Failed to clear recent searches from localStorage', err);
    }
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}
