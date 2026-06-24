'use client';

import { useEffect, useCallback } from 'react';
import { useZenithStore, CelestialBody, Coordinates } from './useZenithStore';

// Dynamically import astronomy-engine only on client
async function computePlanets(lat: number, lng: number, date: Date): Promise<CelestialBody[]> {
  const Astronomy = await import('astronomy-engine');

  const observer = new Astronomy.Observer(lat, lng, 0);
  const time = Astronomy.MakeTime(date);

  const planets = [
    { name: 'Mercury', body: Astronomy.Body.Mercury },
    { name: 'Venus',   body: Astronomy.Body.Venus   },
    { name: 'Mars',    body: Astronomy.Body.Mars    },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Saturn',  body: Astronomy.Body.Saturn  },
    { name: 'Uranus',  body: Astronomy.Body.Uranus  },
    { name: 'Neptune', body: Astronomy.Body.Neptune },
    { name: 'Moon',    body: Astronomy.Body.Moon    },
  ];

  return planets.map(({ name, body }) => {
    try {
      const equ = Astronomy.Equator(body, time, observer, true, true);
      const hor = Astronomy.Horizon(time, observer, equ.ra, equ.dec, 'normal');
      const illum = Astronomy.Illumination(body, time);

      return {
        name,
        type: 'planet',
        altitude: hor.altitude,
        azimuth: hor.azimuth,
        distance: equ.dist * 1.496e8, // AU → km
        magnitude: illum.mag,
        visible: hor.altitude > 0,
      } as CelestialBody;
    } catch {
      return {
        name,
        type: 'planet',
        altitude: 0,
        azimuth: 0,
        visible: false,
      } as CelestialBody;
    }
  });
}

// Major constellation visibility (simplified — based on RA/Dec centre)
const CONSTELLATIONS = [
  { name: 'Orion',       ra: 5.5833,  dec: 0     },
  { name: 'Ursa Major',  ra: 11.0,    dec: 56    },
  { name: 'Ursa Minor',  ra: 15.0,    dec: 75    },
  { name: 'Scorpius',    ra: 16.8833, dec: -30   },
  { name: 'Leo',         ra: 10.5,    dec: 15    },
  { name: 'Cygnus',      ra: 20.5,    dec: 42    },
  { name: 'Cassiopeia',  ra: 1.0,     dec: 60    },
  { name: 'Gemini',      ra: 7.0,     dec: 22    },
  { name: 'Taurus',      ra: 4.7,     dec: 15    },
  { name: 'Virgo',       ra: 13.4,    dec: -4    },
  { name: 'Sagittarius', ra: 19.0,    dec: -25   },
  { name: 'Perseus',     ra: 3.2,     dec: 45    },
];

async function computeConstellations(lat: number, lng: number, date: Date): Promise<CelestialBody[]> {
  const Astronomy = await import('astronomy-engine');
  const observer = new Astronomy.Observer(lat, lng, 0);
  const time = Astronomy.MakeTime(date);

  return CONSTELLATIONS.map(({ name, ra, dec }) => {
    try {
      const hor = Astronomy.Horizon(time, observer, ra, dec, 'normal');
      return {
        name,
        type: 'constellation',
        altitude: hor.altitude,
        azimuth: hor.azimuth,
        visible: hor.altitude > -10, // slightly below horizon still counts
      } as CelestialBody;
    } catch {
      return { name, type: 'constellation', altitude: 0, azimuth: 0, visible: false } as CelestialBody;
    }
  });
}

export function useCelestialData(coords: Coordinates | null) {
  const { setCelestialBodies } = useZenithStore();

  const refresh = useCallback(async () => {
    if (!coords) return;
    const now = new Date();
    const [planets, constellations] = await Promise.all([
      computePlanets(coords.lat, coords.lng, now),
      computeConstellations(coords.lat, coords.lng, now),
    ]);
    setCelestialBodies([...planets, ...constellations]);
  }, [coords, setCelestialBodies]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60_000); // update every minute
    return () => clearInterval(id);
  }, [refresh]);
}
