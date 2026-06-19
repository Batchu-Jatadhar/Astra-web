import { NextResponse } from 'next/server';

// CelesTrak "active satellites" TLE group
const CELESTRAK_URL = 'https://celestrak.org/SOCRATES/query.php';
const TLE_URL = 'https://celestrak.org/SOCRATES/query.php?CATNR=25544&FORMAT=TLE';

// We fetch the "active" group as JSON for easier parsing
const ACTIVE_SATS_JSON = 'https://celestrak.org/SOCRATES/query.php?CATNR=25544&FORMAT=JSON';

// Better: use the GP endpoint for all active satellites
const GP_URL = 'https://celestrak.org/GP/query?GROUP=active&FORMAT=JSON';

export const revalidate = 300; // Cache 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '0');
  const lng = parseFloat(searchParams.get('lng') ?? '0');

  try {
    const res = await fetch(GP_URL);
    if (!res.ok) throw new Error(`CelesTrak error: ${res.status}`);

    const sats: Array<Record<string, unknown>> = await res.json();

    // Return first 200 active satellites (full set is 5000+)
    const subset = sats.slice(0, 200).map((s) => ({
      name: s.OBJECT_NAME,
      catalogNumber: s.CATALOG_NUMBER,
      tle1: s.TLE_LINE1,
      tle2: s.TLE_LINE2,
    }));

    return NextResponse.json({ satellites: subset, lat, lng });
  } catch (err: unknown) {
    console.error('[/api/satellites]', err);
    // Return empty on error so UI degrades gracefully
    return NextResponse.json({ satellites: [], error: 'Satellite data unavailable' });
  }
}
