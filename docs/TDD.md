# Test-Driven Development (TDD) Specification — Weather Dashboard

**Document Version**: 2.3.0  
**Status**: Active & Verified (22/22 Passing)  
**Test Runner**: Vitest 5.0.5  
**Assertion & Render Libraries**: `@testing-library/react`, `@testing-library/jest-dom`, JSDOM  

---

## 1. TDD Philosophy & Testing Pyramid

Weather Dashboard enforces rigorous test-driven design principles where all calculation algorithms, asynchronous state machines, and key user interactions are covered by unit and integration tests.

```
                  ┌────────────────────────┐
                  │    Integration Tests   │  App.test.tsx (5 tests)
                  │  (User Search & UI)    │  SearchBar.test.tsx (4 tests)
                  ├────────────────────────┤
                  │     Hook Unit Tests    │  useRecentSearches.test.ts (5 tests)
                  ├────────────────────────┤
                  │    Core Logic Tests    │  temperatureUtils.test.ts (5 tests)
                  │ (Calculations & Time)  │  forecastUtils.test.ts (3 tests)
                  └────────────────────────┘
```

---

## 2. Test Suites & Coverage Matrix

### 2.1 Core Pure Utilities

#### `src/__tests__/temperatureUtils.test.ts`
- **Purpose**: Verify absolute numerical correctness and formatting for unit toggles (°C ↔ °F).
- **Test Cases**:
  1. `celsiusToFahrenheit`: Verifies $0^\circ\text{C} \to 32^\circ\text{F}$, $100^\circ\text{C} \to 212^\circ\text{F}$, and $-40^\circ\text{C} \to -40^\circ\text{F}$.
  2. `fahrenheitToCelsius`: Verifies reverse conversion with decimal rounding precision.
  3. `formatTemperature`: Checks formatted output string with and without degree symbol (`includeUnit` flag).
  4. Extreme value handling: Ensures NaN, Infinity, or missing inputs fail gracefully.

#### `src/__tests__/forecastUtils.test.ts`
- **Purpose**: Validate grouping of raw 3-hour OpenWeather API items into cohesive, local-calendar daily summaries.
- **Test Cases**:
  1. `groupForecastByDay`: Tests timezone-shifted grouping so days crossing UTC boundaries are assigned to the correct destination local date.
  2. Min/Max Calculation: Validates that true mathematical day minimums and maximums across all 3-hour intervals are recorded accurately.
  3. Midday Representative Weather: Verifies that weather condition is prioritized around 12:00–15:00 local time.

---

### 2.2 Custom Hooks & Storage Layer

#### `src/__tests__/useRecentSearches.test.ts`
- **Purpose**: Validate persistence, deduplication, and FIFO capping of searched locations in `localStorage`.
- **Test Cases**:
  1. `Initial Load`: Reads existing items from `localStorage`.
  2. `addSearch`: Prepends new city with accurate timestamp; shifts older entries down.
  3. `Deduplication`: Re-searching an existing city moves it to index 0 without duplicating.
  4. `Max Limit (FIFO)`: Caps saved searches to maximum items (e.g. 10).
  5. `clearSearches`: Empties storage and resets state.

---

### 2.3 Component & Interaction Integration Tests

#### `src/__tests__/SearchBar.test.tsx`
- **Purpose**: Validate user search input, form submissions, and loading state triggers.
- **Test Cases**:
  1. `Renders input and submit button`: Validates placeholder and accessible roles.
  2. `Triggers onSearch callback`: Typing "Tokyo" and pressing Enter or clicking Search calls handler with trimmed input.
  3. `Empty input handling`: Prevents submission when input consists only of whitespace.
  4. `Location button click`: Invokes `onUseCurrentLocation` callback.

#### `src/__tests__/App.test.tsx`
- **Purpose**: End-to-end integration test verifying full app rendering, mode toggles, and live search reactions.
- **Test Cases**:
  1. `renders initial dashboard header and search bar correctly`: Verifies station header and initial city data render.
  2. `toggles dark mode class on documentElement`: Verifies theme toggle updates HTML root attributes.
  3. `toggles temperature unit`: Verifies switching from Celsius to Fahrenheit updates all displayed temperatures.
  4. `renders 5-day / 7-day forecast cards`: Verifies forecast cards render with weather icons and min/max temperatures.
  5. `performs city search`: Verifies searching a new location loads its weather profile and updates the station display.

---

## 3. Test Execution & CI Commands

```bash
# Run full Vitest suite in single-run mode
npm test -- --run

# Run in watch mode for development
npm test

# Run with test coverage report
npx vitest run --coverage
```

---

## 4. Regression Prevention Checklist
- [x] All state updates inside tests are executed in valid test render trees.
- [x] Mock timers and API abort controllers are properly cleaned up between runs.
- [x] Headings and buttons feature unique accessible names to avoid multi-match test collisions.
