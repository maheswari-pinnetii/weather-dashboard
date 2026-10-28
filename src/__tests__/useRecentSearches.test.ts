import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentSearches } from '../hooks/useRecentSearches';

describe('useRecentSearches Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty array if nothing in localStorage', () => {
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentSearches).toEqual([]);
  });

  it('adds cities to search history and stores them in localStorage', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('Paris', 'FR');
    });

    expect(result.current.recentSearches.length).toBe(1);
    expect(result.current.recentSearches[0].name).toBe('Paris');

    const stored = JSON.parse(localStorage.getItem('weather_dashboard_recent_searches') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe('Paris');
  });

  it('prevents case-insensitive duplicates and moves the searched item to the front', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('Tokyo');
      result.current.addSearch('Berlin');
      result.current.addSearch('tokyo'); // Duplicate in lowercase
    });

    expect(result.current.recentSearches.length).toBe(2);
    expect(result.current.recentSearches[0].name).toBe('tokyo');
    expect(result.current.recentSearches[1].name).toBe('Berlin');
  });

  it('caps list at maximum 5 cities', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('City 1');
      result.current.addSearch('City 2');
      result.current.addSearch('City 3');
      result.current.addSearch('City 4');
      result.current.addSearch('City 5');
      result.current.addSearch('City 6');
    });

    expect(result.current.recentSearches.length).toBe(5);
    expect(result.current.recentSearches[0].name).toBe('City 6');
  });

  it('removes a specific search item and clears all', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('Sydney');
      result.current.addSearch('Rome');
    });

    const romeId = result.current.recentSearches[0].id;
    act(() => {
      result.current.removeSearch(romeId);
    });

    expect(result.current.recentSearches.length).toBe(1);
    expect(result.current.recentSearches[0].name).toBe('Sydney');

    act(() => {
      result.current.clearSearches();
    });

    expect(result.current.recentSearches.length).toBe(0);
  });
});
