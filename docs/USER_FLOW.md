# User Flows & Journey Maps — Weather Dashboard

**Document Version**: 2.3.0  
**Status**: Production-Ready  
**Scope**: End-to-End User Journeys, Interaction Decision Trees, and State Transitions  

---

## 1. Overview

Weather Dashboard is structured to serve two distinct user behaviors:
1. **Quick-Glance Utility**: Fast weather checks, city switching, temperature unit conversion, and calendar export.
2. **Ambient Living Mode**: Persistent smart-display usage on tablets or desktop screens with microclimate sensors and landscape backdrops.

---

## 2. Primary User Journey Flows

### Flow 1: Location Search & Real-Time Sync
```
[User arrives on Dashboard]
           │
           ▼
[Inputs city name in Search Bar or clicks Recent Search Chip]
           │
           ├─> [Empty input] ──> Block submission & prompt user
           │
           ▼
[Search submitted]
           │
           ▼
[Display Skeleton / Loading Indicators]
           │
           ├─> [Valid city found]
           │         │
           │         ├─> 1. Synchronize Weather Station:
           │         │      • Adjust digital clock & calendar to destination timezone offset
           │         │      • Update indoor & outdoor microclimate sensor readings
           │         │      • Calculate local sunrise & sunset solar times
           │         │
           │         ├─> 2. Synchronize 7-Day Forecast (Monday to Sunday):
           │         │      • Group 3-hour forecasts into local days
           │         │      • Render temperatures, conditions, and icons
           │         │
           │         └─> 3. Synchronize Nature Landscape:
           │                • Automatically select Index 0 (`setCurrentLandscapeIndex(0)`)
           │                • Procedurally generate landscape reflecting searched city climate & solar hour
           │
           └─> [City not found / Network error]
                     │
                     ▼
             [Display non-intrusive Error Alert with "Retry" action]
             [Preserve previous valid weather state to prevent layout collapse]
```

---

### Flow 2: 7-Day Monday to Sunday Forecast & Day Preview
```
[User views 7-Day Forecast Grid (Mon - Sun)]
           │
           ▼
[Clicks on a specific day (e.g. Wednesday or Saturday)]
           │
           ▼
[Dashboard enters "Preview Mode"]
           │
           ├─> Station Header indicates: "Previewing [DayName]"
           ├─> Station temperature & weather icon update to selected day's parameters
           ├─> Indoor & outdoor sensor calculations reflect selected day's climate
           ├─> "Reset to Today ↺" button becomes visible in top status bar
           │
           ▼
[User clicks "Reset to Today ↺" or selects live today card]
           │
           ▼
[Station restores real-time local weather observations]
```

---

### Flow 3: Calendar Schedule & Event Export (Google Calendar / iCalendar)
```
[User clicks "Calendar" or accesses Calendar Schedule]
           │
           ▼
[7-Day Monday to Sunday Schedule View renders]
           │
           ├──> Option A: One-Click Google Calendar Event
           │          │
           │          ▼
           │     [User clicks "Google Cal" under any forecast day]
           │          │
           │          ▼
           │     [Opens Google Calendar web intent with pre-populated event]:
           │     • Title: "[Condition] ([High] / [Low]) in [City]"
           │     • Date: All-day event on forecast date
           │     • Notes: Detailed weather description, humidity, and wind stats
           │
           └──> Option B: Universal .ics (iCalendar) Export
                      │
                      ▼
                 [User clicks "Export (.ics)"]
                      │
                      ▼
                 [Client-side RFC 5545 generator formats 7-day VCALENDAR]
                      │
                      ▼
                 [Triggers browser download: "[City]_Weather_Forecast.ics"]
                      │
                      ▼
                 [Importable into Apple Calendar, Outlook, Google Calendar]
```

---

### Flow 4: Ambient Nature Landscapes & Display Mode
```
[User clicks "Nature Landscapes" tab on bottom dock]
           │
           ▼
[Ambient Display Mode opens]
           │
           ├─> Lead Card (Index 0): Procedural Real-Time Landscape of Searched City
           │     • Adapts to local solar hour: Daytime / Sunset Twilight / Starlit Night
           │     • Adapts to weather condition: Rain / Snow / Cloud / Storm / Mist / Sun
           │
           ├─> Global Curated Slides:
           │     • Alpine Peak Sunset (Swiss Alps)
           │     • Misty Nordic Fjord (Norway)
           │     • Pacific Redwood Coast (California)
           │     • Kyoto Autumn Canopy (Japan)
           │
           ├──> Controls:
           │     • Autoplay Toggle: Pause / Resume 6-second timer
           │     • Chevrons & Thumbnails: Instant slide switching
           │     • "Full Display" Mode:
           │           │
           │           ▼
           │     [Fullscreen immersive theater view]
           │     • Panoramic backdrop edge-to-edge
           │     • Floating live digital clock & temperature badge
           │     • Atmospheric descriptions and navigation dots
           │     • Quick exit (Escape key or Close button)
           │
           └──> Return to Station: Click "Weather Station" tab on dock
```

---

### Flow 5: User Settings & Customization
```
[User opens "Settings" or toggles Header Quick Controls]
           │
           ├──> Temperature Unit Switch (°C ↔ °F):
           │     • Instant zero-latency math recalculation across all cards
           │     • No network re-fetch needed
           │
           ├──> Theme Toggle (Dark / Light):
           │     • Applies `.dark` class to `<html>` root
           │     • Smooth CSS variable color transitions
           │     • Persists in `localStorage`
           │
           ├──> Display Brightness Slider (30% - 100%):
           │     • Controls dashboard ambient display luminance for bedside/desk use
           │
           └──> View Mode Toggle:
                 • Weather Station Living Mode vs Standard 2-Column Mode
```
