# 🌌 Project Zenith: The Celestial Eye

> A real-time cosmic radar — select any coordinate on Earth and instantly see what's overhead: ISS, active satellites, planets, and constellations.

![Project Zenith Banner](public/assets/banner.png)

---

## 🚀 Features

- **Interactive Dark Map** — Click anywhere on a Carto dark-themed Leaflet map to select your zenith point. Or type coordinates manually or use your device's GPS.
- **Live ISS Tracking** — Polls OpenNotify every 5 seconds. Shows real-time latitude, longitude, altitude (~408 km), velocity (~7.66 km/s) and an animated orbit trail.
- **Planet Positions** — Uses `astronomy-engine` to compute real-time altitude/azimuth/magnitude for Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and the Moon.
- **Constellation Visibility** — 12 major constellations computed for your location and time.
- **Radar Display** — Canvas-based polar sky chart with animated sweep, showing all visible objects by altitude/azimuth.
- **Satellite Catalog** — Fetches up to 200 active satellites from CelesTrak's GP endpoint.
- **Responsive UI** — CSS Grid + Flexbox layout, works on mobile, tablet, and desktop.
- **Cosmic Design** — Orbitron display font, glassmorphism cards, glowing accents, animated star field.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| Map | Leaflet + react-leaflet |
| Astronomy | astronomy-engine |
| State | Zustand |
| Animation | Framer Motion |
| ISS API | OpenNotify (`api.open-notify.org`) |
| Satellite TLE | CelesTrak GP endpoint |
| Planets | NASA Horizons (future) / astronomy-engine |

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/project-zenith.git
cd project-zenith
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` in the project root:

```env
# No API keys required for base features.
# NASA Horizons API (optional, for extended planet data):
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key_here
```

Get a free NASA API key at: https://api.nasa.gov/

---

## 📦 Dependencies

```json
{
  "next": "14.2.3",
  "react": "^18",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "astronomy-engine": "^2.1.19",
  "satellite.js": "^5.0.0",
  "zustand": "^4.5.2",
  "framer-motion": "^11.1.7",
  "three": "^0.163.0",
  "@react-three/fiber": "^8.16.3",
  "@react-three/drei": "^9.105.4"
}
```

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main page
│   └── api/
│       ├── iss/route.ts    # Proxy: OpenNotify ISS
│       └── satellites/route.ts  # Proxy: CelesTrak GP
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Nav + UTC clock
│   │   └── HeroOverlay.tsx     # Pre-selection overlay
│   ├── map/
│   │   └── CosmicMap.tsx       # Leaflet map + ISS marker
│   ├── celestial/
│   │   ├── CoordinatePanel.tsx # Lat/lng input + geolocate
│   │   ├── CelestialDashboard.tsx  # Radar chart
│   │   ├── ISSTracker.tsx      # Live ISS data card
│   │   ├── PlanetPanel.tsx     # Planet visibility list
│   │   ├── SatellitePanel.tsx  # Active satellite list
│   │   └── ConstellationOverlay.tsx # Constellation grid
│   └── ui/
│       └── StarField.tsx       # Animated background stars
├── hooks/
│   ├── useZenithStore.ts       # Zustand global state
│   ├── useISSTracking.ts       # ISS polling hook
│   └── useCelestialData.ts     # Planet/constellation computation
├── lib/
│   ├── utils.ts                # Math helpers
│   └── astronomy.d.ts          # Type shims
└── styles/
    └── globals.css             # Tailwind + cosmic theme
```

---

## 🌍 APIs Used

| API | Purpose | Rate Limit |
|-----|---------|-----------|
| [OpenNotify](http://api.open-notify.org/iss-now.json) | ISS real-time position | Unlimited |
| [CelesTrak GP](https://celestrak.org/GP/query?GROUP=active&FORMAT=JSON) | Active satellite TLE data | Fair use |
| [astronomy-engine](https://github.com/cosinekitty/astronomy) | Client-side planet calculations | N/A (local) |

---

## 🔮 Extending the Project

### Add NASA Horizons for precise planetary ephemeris
```typescript
// src/app/api/horizons/route.ts
const url = `https://ssd.jpl.nasa.gov/api/horizons.api?COMMAND='499'&...`;
```

### Add satellite.js for TLE propagation
```typescript
import { twoline2satrec, propagate, gstime, eciToGeodetic } from 'satellite.js';
// Compute satellite position from TLE at current time
```

### Add Three.js 3D globe
```typescript
// src/components/map/Globe3D.tsx — already in dependencies
import { Canvas } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<768px) | Single column stack |
| Tablet (768–1024px) | 2-column grid |
| Desktop (>1024px) | 3-column dashboard |

---

## 🏆 AstralWeb Innovate Round 2

Built for **AstralWeb Innovate Round 2** (June 10–26, 2026).

**Submission checklist:**
- [x] Live hosted URL
- [x] Public GitHub repository  
- [x] Comprehensive README
- [x] Responsive UI (Grid + Flexbox)
- [x] Interactive map
- [x] Real-time data fetching (ISS + satellites)
- [x] Astronomical accuracy (astronomy-engine)
- [x] Cosmic UI theme
- [x] Clean architecture + documented code

---

## 📄 License

MIT — free to use, modify, and distribute.
