import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch('http://api.open-notify.org/iss-now.json', {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`OpenNotify error: ${res.status}`);
    const data = await res.json();

    // Augment with static altitude / velocity (OpenNotify doesn't provide these)
    return NextResponse.json({
      ...data,
      altitude: 408,    // km average
      velocity: 7.66,   // km/s average
    });
  } catch (err: unknown) {
    console.error('[/api/iss]', err);
    return NextResponse.json({ error: 'Failed to fetch ISS data' }, { status: 502 });
  }
}
