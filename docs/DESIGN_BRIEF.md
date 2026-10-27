# Design Brief & Design System — Weather Dashboard

**Document Version**: 2.3.0  
**Design Paradigm**: Modern Glassmorphism, Alpine Smart-Living Station & Atmospheric Realism  
**Target Viewports**: Mobile (360px+), Tablet (768px+), Desktop & Smart Displays (1024px–2560px)  

---

## 1. Visual Design Philosophy & Brand Pillars

1. **Atmospheric Elegance & Wow Factor**:
   - The interface feels alive. It uses rich, harmonized gradients, translucent frosted-glass surfaces, micro-animations, and dynamic real-time landscapes rather than static plain cards.
2. **High-Density Information Architecture**:
   - Inspired by modern smart-home stations (Netatmo, Eve, Braun digital stations), data is presented with clear visual hierarchy, scannable typographic scales, and contextual icons.
3. **Human-Centered Visual Metaphors**:
   - Exclusively uses clean, vector-crafted human icons (Lucide SVG symbols) and avoids robotic or generic clip art.
4. **Adaptive Dark & Light Modes**:
   - Deep slate and midnight indigo for dark mode with subtle glows; clean, luminous porcelain and cobalt accents for light mode.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Neutrals & Atmosphere
| Token | Dark Mode Value | Light Mode Value | Usage |
|---|---|---|---|
| `--bg-base` | `#020617` (Slate 950) | `#f8fafc` (Slate 50) | Main application background |
| `--surface-glass` | `rgba(15, 23, 42, 0.75)` | `rgba(255, 255, 255, 0.85)` | Glassmorphism cards & tiles |
| `--surface-border` | `rgba(255, 255, 255, 0.10)` | `rgba(148, 163, 184, 0.25)` | Tile borders & dividers |
| `--text-primary` | `#ffffff` | `#0f172a` (Slate 900) | Primary headings, values, and clock |
| `--text-secondary` | `#94a3b8` (Slate 400) | `#475569` (Slate 600) | Subtitles, sensor labels, metadata |

### 2.2 Functional Accents
| Token | Hex / HSL | Semantic Meaning |
|---|---|---|
| `--color-accent-blue` | `#38bdf8` / `#2563eb` | Primary actions, search triggers, active tabs |
| `--color-comfort-green` | `#34d399` / `#10b981` | CO₂ optimal status, Wi-Fi connected, healthy air |
| `--color-warning-amber` | `#fbbf24` / `#f59e0b` | Sunset golden hour, moderate humidity, warm alert |
| `--color-danger-rose` | `#f43f5e` / `#e11d48` | Severe storms, freezing warnings, high UV index |

---

## 3. Typography Hierarchy

Weather Dashboard uses modern sans-serif typography (`Inter` / system-ui stack) with tight tracking and optical sizing:

- **Hero Digital Clock**: `text-5xl sm:text-6xl font-light tracking-tight` (Clean digital station time)
- **Primary Temperature**: `text-4xl font-extrabold tracking-tight` (Hero temperature glance)
- **Section Headings (H2 / H3)**: `text-xl sm:text-2xl font-bold tracking-tight text-white`
- **Metric Labels & Overlays**: `text-xs font-semibold uppercase tracking-wider`
- **Data & Timestamp Badges**: `text-[10px] font-mono`

---

## 4. UI Components & Layout Specs

### 4.1 Glassmorphic Tiles (`.glass-tile`)
- **Backdrop Blur**: `backdrop-blur-xl` (16px–24px blur filter)
- **Border Radius**: `rounded-3xl` (24px) for major cards, `rounded-2xl` (16px) for inner modules
- **Inner Rim Lighting**: `border border-white/10 dark:border-white/10` with soft box-shadow `0 20px 25px -5px rgba(0, 0, 0, 0.3)`

### 4.2 Real-Time Nature Panorama Specifications
- **Aspect Ratio**: Optimized 16:9 panoramic viewport with subtle depth gradients (`from-slate-950/85 via-slate-950/30 to-black/40`)
- **Artwork Vector Rendering**: Scalable SVG vector art layered with linear sky gradients, sun/moon positions, mountain polygonal silhouettes, and weather particle patterns.
- **Microclimate Badges**: Floating frosted glass pills (`bg-black/50 backdrop-blur-md`) positioned at corner coordinates.

### 4.3 7-Day Monday to Sunday Grid
- **Columns**: 7 equal responsive columns (`lg:grid-cols-7 sm:grid-cols-4 grid-cols-2`)
- **States**:
  - *Default*: Soft translucent surface with subtle hover scale (`scale-[1.02]`).
  - *Today Active*: Sapphire blue glow with pulse badge (`ring-2 ring-blue-400/40`).
  - *Preview Selected*: Sky blue accent ring (`ring-2 ring-sky-300`).

---

## 5. Accessibility & Motion Guidelines

1. **Touch Targets**: All interactive elements (buttons, search inputs, day cards, sliders) maintain a minimum target area of $44 \times 44\text{px}$.
2. **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling slideshow transitions and radar ping animations.
3. **Contrast Ratios**: Body text meets WCAG AA standards (minimum 4.5:1 ratio against card backgrounds).
