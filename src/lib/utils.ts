/**
 * Convert decimal degrees to DMS string: 40°26'46"N
 */
export function toDMS(degrees: number, isLat: boolean): string {
  const abs = Math.abs(degrees);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = ((abs - d - m / 60) * 3600).toFixed(1);
  const dir = isLat ? (degrees >= 0 ? 'N' : 'S') : (degrees >= 0 ? 'E' : 'W');
  return `${d}°${m}'${s}"${dir}`;
}

/** Azimuth in degrees to compass point */
export function azimuthToCompass(az: number): string {
  const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return points[Math.round(az / 22.5) % 16];
}

/** Altitude in degrees to "overhead" description */
export function altitudeDescription(alt: number): string {
  if (alt > 80)  return 'Nearly overhead';
  if (alt > 60)  return 'High in sky';
  if (alt > 40)  return 'Well above horizon';
  if (alt > 20)  return 'Above horizon';
  if (alt > 5)   return 'Low in sky';
  if (alt > 0)   return 'Near horizon';
  return 'Below horizon';
}

/** Great-circle distance between two lat/lng points (km) */
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Format km distance */
export function formatDistance(km: number): string {
  if (km > 1_000_000) return `${(km / 1_000_000).toFixed(2)} M km`;
  if (km > 1_000)     return `${(km / 1_000).toFixed(1)} k km`;
  return `${km.toFixed(0)} km`;
}

/** Julian Date from JS Date */
export function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Local Sidereal Time (degrees) */
export function localSiderealTime(date: Date, lng: number): number {
  const jd = toJulianDate(date);
  const T  = (jd - 2451545.0) / 36525;
  const GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * 0.000387933;
  return ((GMST + lng) % 360 + 360) % 360;
}
