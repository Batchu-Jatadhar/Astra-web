'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useZenithStore } from './useZenithStore';

const ISS_API = 'https://api.open-notify.org/iss-now.json';
const REFRESH_INTERVAL = 5000; // 5 seconds

export function useISSTracking() {
  const { setISSPosition, setLoading } = useZenithStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchISS = useCallback(async () => {
    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const res = await fetch(`/api/iss`, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error('ISS fetch failed');
      const data = await res.json();

      setISSPosition({
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        altitude: data.altitude ?? 408,
        velocity: data.velocity ?? 7.66,
        timestamp: data.timestamp,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
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
      abortRef.current?.abort();
    };
  }, [fetchISS, setLoading]);
}
