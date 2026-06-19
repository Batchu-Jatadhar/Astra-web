'use client';

import { useZenithStore } from '@/hooks/useZenithStore';

export default function HeroOverlay() {
  const { coordinates } = useZenithStore();

  if (coordinates) return null; // Hide once user has selected a location

  return (
    <div className="absolute inset-x-0 top-32 pointer-events-none z-0 flex justify-center">
      <div className="select-none px-4 text-center opacity-10">
        <h2 className="font-display text-6xl font-black tracking-widest text-aurora md:text-8xl">
          ZENITH
        </h2>
      </div>
    </div>
  );
}
