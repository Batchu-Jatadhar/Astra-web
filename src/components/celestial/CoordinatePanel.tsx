'use client';

import { useEffect, useState } from 'react';
import { useZenithStore } from '@/hooks/useZenithStore';

export default function CoordinatePanel() {
  const { coordinates, setCoordinates } = useZenithStore();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!coordinates) return;
    setLat(String(coordinates.lat));
    setLng(String(coordinates.lng));
  }, [coordinates]);

  const handleSubmit = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setError('Enter valid decimal coordinates.');
      return;
    }
    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      setError('Coordinates out of range.');
      return;
    }
    setError('');
    setCoordinates({ lat: parsedLat, lng: parsedLng });
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({
          lat: parseFloat(pos.coords.latitude.toFixed(4)),
          lng: parseFloat(pos.coords.longitude.toFixed(4)),
          label: 'Your Location',
        });
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setGeoLoading(false);
      },
      () => {
        setError('Geolocation denied.');
        setGeoLoading(false);
      }
    );
  };

  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-sm text-white tracking-wide">Choose Your Sky</h2>
            <p className="mt-1 text-xs leading-5 text-starlight/55">
              Set a point on Earth to calculate what is overhead.
            </p>
          </div>
          <span className="rounded-full border border-aurora/25 bg-aurora/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-aurora">
            Step 1
          </span>
        </div>
      </div>

      <button
        onClick={handleGeolocate}
        disabled={geoLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-aurora/35 bg-aurora/15 px-3 py-3 font-display text-xs tracking-widest text-aurora transition-all hover:border-aurora/60 hover:bg-aurora/25 hover:shadow-[0_0_20px_rgba(79,195,247,0.18)] disabled:cursor-wait disabled:opacity-70"
        title="Use my location"
      >
        <span>{geoLoading ? 'Scanning...' : 'Use My Current Location'}</span>
      </button>

      <div className="relative flex items-center">
        <div className="h-px flex-1 bg-white/10" />
        <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-starlight/35">or enter manually</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-mono text-[10px] text-starlight/50 tracking-widest block mb-1">
            LATITUDE
          </label>
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="43.6532"
            min={-90} max={90} step="any"
            className="w-full rounded-lg border border-white/10 bg-void/75 px-3 py-2 text-sm font-mono text-starlight outline-none transition-colors placeholder:text-starlight/25 focus:border-aurora/70 focus:bg-void"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] text-starlight/50 tracking-widest block mb-1">
            LONGITUDE
          </label>
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="-79.3832"
            min={-180} max={180} step="any"
            className="w-full rounded-lg border border-white/10 bg-void/75 px-3 py-2 text-sm font-mono text-starlight outline-none transition-colors placeholder:text-starlight/25 focus:border-aurora/70 focus:bg-void"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-400/20 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-300">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-white px-3 py-3 font-display text-xs tracking-widest text-void transition-all hover:bg-aurora hover:shadow-[0_0_22px_rgba(79,195,247,0.25)]"
      >
        Scan This Location
      </button>

      <p className="text-center text-[11px] leading-5 text-starlight/40">
        Tip: you can also click directly on the map.
      </p>

      {coordinates && (
        <>
          <div className="panel-rule" />
          <div className="rounded-lg border border-aurora/15 bg-aurora/[0.06] p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-starlight/45">Selected point</p>
            <div className="data-stream space-y-0.5">
              <p>LAT <span className="text-aurora">{coordinates.lat}°</span></p>
              <p>LNG <span className="text-aurora">{coordinates.lng}°</span></p>
              {coordinates.label && (
                <p>LOC <span className="text-comet">{coordinates.label}</span></p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
