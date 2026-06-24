'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useZenithStore } from './useZenithStore';

const REFRESH_INTERVAL = 10000; // 10 seconds

export function useISSTracking() {
  const { setISSPosition, setLoading } = useZenithStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchISS = useCallback(async () => {
    try {
      let data;
      try {
        // Try direct browser fetch first (bypasses Node.js network/DNS issues in WSL/Windows)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const directRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!directRes.ok) throw new Error('Direct fetch failed');
        const directData = await directRes.json();
        
        data = {
          iss_position: {
            latitude: String(directData.latitude),
            longitude: String(directData.longitude),
          },
          altitude: Math.round(directData.altitude),
          velocity: parseFloat((directData.velocity / 3600).toFixed(2)),
          timestamp: Math.floor(directData.timestamp),
        };
      } catch (directErr) {
        // Fallback to our Next.js API route if direct fetch fails (e.g. CORS or adblocker)
        const res = await fetch(`/api/iss`);
        if (!res.ok) throw new Error('Backend ISS fetch failed');
        data = await res.json();
      }

      if (data && data.iss_position) {
        setISSPosition({
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          altitude: data.altitude ?? 408,
          velocity: data.velocity ?? 7.66,
          timestamp: data.timestamp,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[ISS Tracker]', err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [setISSPosition, setLoading]);

  useEffect(() => {
    setLoading(true);
    fetchISS();
    intervalRef.current = setInterval(fetchISS, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchISS, setLoading]);
}
