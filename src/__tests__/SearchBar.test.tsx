import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar Component', () => {
  it('renders input and buttons correctly', () => {
    render(
      <SearchBar
        onSearch={vi.fn()}
        onUseCurrentLocation={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByPlaceholderText(/search for a city/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /use current location/i })).toBeInTheDocument();
  });

  it('rejects empty input and displays validation message without firing onSearch', () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        onUseCurrentLocation={vi.fn()}
        isLoading={false}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/please enter a city name/i)).toBeInTheDocument();
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('submits trimmed city query when valid', () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        onUseCurrentLocation={vi.fn()}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/search for a city/i);
    fireEvent.change(input, { target: { value: '  London  ' } });

    const submitBtn = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submitBtn);

    expect(handleSearch).toHaveBeenCalledWith('London');
  });

  it('triggers onUseCurrentLocation when location button is clicked', () => {
    const handleLocation = vi.fn();
    render(
      <SearchBar
        onSearch={vi.fn()}
        onUseCurrentLocation={handleLocation}
        isLoading={false}
      />
    );

    const locBtn = screen.getByRole('button', { name: /use current location/i });
    fireEvent.click(locBtn);

    expect(handleLocation).toHaveBeenCalledTimes(1);
  });
});
