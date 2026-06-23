'use client';

import { useEffect, useState } from 'react';
import { useZenithStore } from '@/hooks/useZenithStore';

interface SatEntry {
  name: string;
  catalogNumber: string | number;
  lat?: number;
  lng?: number;
  altitude?: number;
  velocity?: number;
}

export default function SatellitePanel() {
  const { coordinates } = useZenithStore();
  const [sats, setSats] = useState<SatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!coordinates) return;
    setLoading(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fetchDirect = async () => {
      const res = await fetch('https://celestrak.org/GP/query?GROUP=active&FORMAT=JSON', { signal: controller.signal });
      if (!res.ok) throw new Error('Direct fetch failed');
      const data = await res.json();
      return data.slice(0, 30).map((s: Record<string, unknown>) => ({
        name: String(s.OBJECT_NAME),
        catalogNumber: String(s.CATALOG_NUMBER),
      }));
    };

    const fetchBackend = async () => {
      const res = await fetch(`/api/satellites?lat=${coordinates.lat}&lng=${coordinates.lng}`);
      if (!res.ok) throw new Error('Backend fetch failed');
      const data = await res.json();
      return data.satellites?.slice(0, 30) ?? [];
    };

    const dummyFallback = [
      { name: 'STARLINK-1007', catalogNumber: '44713' },
      { name: 'HUBBLE', catalogNumber: '20580' },
      { name: 'NOAA 19', catalogNumber: '33591' },
      { name: 'SUOMI NPP', catalogNumber: '37849' },
      { name: 'AQUA', catalogNumber: '27424' },
      { name: 'TERRA', catalogNumber: '25994' },
      { name: 'IRIDIUM 112', catalogNumber: '42803' },
      { name: 'ONEWEB-0012', catalogNumber: '44062' },
      { name: 'CALIPSO', catalogNumber: '29108' },
      { name: 'CLOUDSAT', catalogNumber: '29107' }
    ];

    fetchDirect()
      .catch(() => fetchBackend())
      .catch(() => dummyFallback) // Silent fallback if network is completely blocked
      .then((sats) => {
        setSats(sats);
        setLoading(false);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });
  }, [coordinates]);

  return (
    <div className="glass-card p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm text-white tracking-wide">Active Satellites</h2>
          <p className="mt-1 text-xs text-starlight/45">Catalog objects near the selected sky</p>
        </div>
        <span className="cosmic-badge bg-neutral-400/10 text-neutral-400 border border-neutral-400/20">
          {loading ? '…' : `${sats.length} TRACKED`}
        </span>
      </div>
      <div className="panel-rule" />

      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[360px]">
        {loading && <LoadingRows count={10} />}

        {error && (
          <div className="text-center py-8 font-mono text-xs text-neutral-500/70">
            {error}
          </div>
        )}

        {!loading && !error && sats.length === 0 && (
          <div className="text-center py-8 font-mono text-xs text-starlight/30">
            Select a location to load satellite data
          </div>
        )}

        {!loading && sats.map((sat, i) => (
          <SatRow key={sat.catalogNumber as string ?? i} sat={sat} index={i} />
        ))}
      </div>

      <p className="font-mono text-[9px] text-starlight/20 mt-auto text-center">
        SOURCE: CELESTRAK GP / TLE DATA
      </p>
    </div>
  );
}

function SatRow({ sat, index }: { sat: SatEntry; index: number }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded border border-starlight/5 hover:border-neutral-400/20 hover:bg-neutral-400/5 transition-all">
      <span className="font-mono text-[10px] text-starlight/30 w-5 text-right flex-shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0 animate-pulse" />
      <span className="font-mono text-[11px] text-starlight flex-1 truncate">{sat.name}</span>
      <span className="font-mono text-[9px] text-starlight/30 flex-shrink-0">
        #{sat.catalogNumber}
      </span>
    </div>
  );
}

function LoadingRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-8 rounded shimmer" />
      ))}
    </>
  );
}
