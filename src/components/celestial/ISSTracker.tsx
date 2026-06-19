'use client';

import { useZenithStore } from '@/hooks/useZenithStore';
import { useEffect, useState } from 'react';

export default function ISSTracker() {
  const { issPosition } = useZenithStore();
  const [pulse, setPulse] = useState(false);

  // Flash on update
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [issPosition?.timestamp]);

  return (
    <div className={`glass-card p-4 transition-all duration-300 ${pulse ? 'border-yellow-400/40' : ''}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🛸</span>
            <h2 className="font-display text-sm text-white tracking-wide">ISS Tracker</h2>
          </div>
          <p className="mt-1 text-xs text-starlight/45">Updates every few seconds</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1">
          <span className="blip" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-300">Live</span>
        </div>
      </div>
      <div className="panel-rule mb-3" />

      {issPosition ? (
        <div className="data-stream space-y-1">
          <Row label="LAT" value={`${issPosition.latitude.toFixed(4)}°`} color="solar" />
          <Row label="LNG" value={`${issPosition.longitude.toFixed(4)}°`} color="solar" />
          <Row label="ALT" value={`${issPosition.altitude} km`} color="aurora" />
          <Row label="VEL" value={`${issPosition.velocity} km/s`} color="aurora" />
          <Row label="UPD" value={new Date(issPosition.timestamp * 1000).toISOString().slice(11, 19) + ' UTC'} color="comet" />
        </div>
      ) : (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 rounded shimmer" />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    solar: 'text-yellow-400',
    aurora: 'text-sky-400',
    comet: 'text-violet-400',
  };
  return (
    <div className="flex justify-between">
      <span className="text-starlight/40">{label}</span>
      <span className={`${colorMap[color]} font-medium`}>{value}</span>
    </div>
  );
}
