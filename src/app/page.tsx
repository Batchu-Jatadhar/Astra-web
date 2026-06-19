'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import HeroOverlay from '@/components/layout/HeroOverlay';
import CoordinatePanel from '@/components/celestial/CoordinatePanel';
import CelestialDashboard from '@/components/celestial/CelestialDashboard';
import ISSTracker from '@/components/celestial/ISSTracker';
import ConstellationOverlay from '@/components/celestial/ConstellationOverlay';
import SatellitePanel from '@/components/celestial/SatellitePanel';
import PlanetPanel from '@/components/celestial/PlanetPanel';
import { useZenithStore } from '@/hooks/useZenithStore';

// Leaflet must be dynamically imported (no SSR)
const CosmicMap = dynamic(() => import('@/components/map/CosmicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center glass-card">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-2 border-aurora border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-aurora text-sm tracking-widest">INITIALIZING MAP</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const { coordinates } = useZenithStore();

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(79,195,247,0.14),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.12),transparent_26%),#04060F]">
      <Header />

      {/* Hero + Map section */}
      <section className="relative flex-1">
        <HeroOverlay />

        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="cosmic-badge border border-aurora/25 bg-aurora/10 text-aurora">
                Live sky map
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-wide text-white md:text-5xl">
                See what is above any place on Earth.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-starlight/70 md:text-base">
                Click the map, use your current location, or enter coordinates to reveal planets,
                constellations, the ISS, and active satellites for that exact sky.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-2 text-center backdrop-blur">
              <MiniStat label="ISS" value="Live" tone="text-yellow-300" />
              <MiniStat label="Planets" value="8+" tone="text-sky-300" />
              <MiniStat label="Satellites" value="30" tone="text-emerald-300" />
            </div>
          </div>

          {/* Map + coordinate input row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="relative lg:col-span-2 h-[520px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-sky-950/30">
              <div className="pointer-events-none absolute left-16 top-4 z-[500] max-w-xs rounded-lg border border-white/10 bg-void/80 px-4 py-3 backdrop-blur-md">
                <p className="font-display text-xs tracking-widest text-aurora">
                  {coordinates ? 'ZENITH POINT SET' : 'START HERE'}
                </p>
                <p className="mt-1 text-sm leading-5 text-starlight/75">
                  {coordinates
                    ? `${coordinates.lat}°, ${coordinates.lng}°`
                    : 'Click anywhere on the map to scan the sky above that location.'}
                </p>
              </div>
              <CosmicMap />
            </div>
            <div className="flex flex-col gap-4">
              <CoordinatePanel />
              <ISSTracker />
            </div>
          </div>

          {/* Main celestial dashboard */}
          {coordinates && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1">
                <CelestialDashboard />
              </div>
              <div className="xl:col-span-1">
                <PlanetPanel />
              </div>
              <div className="xl:col-span-1">
                <SatellitePanel />
              </div>
            </div>
          )}

          {/* Constellation overlay panel (full-width) */}
          {coordinates && (
            <div className="mt-6">
              <ConstellationOverlay />
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-aurora/10 py-6 text-center">
        <p className="text-starlight/40 font-mono text-xs tracking-widest">
          PROJECT ZENITH: THE CELESTIAL EYE · REAL-TIME COSMIC RADAR · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="min-w-[82px] rounded-md bg-void/50 px-3 py-2">
      <div className={`font-display text-sm font-bold ${tone}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-starlight/45">{label}</div>
    </div>
  );
}
