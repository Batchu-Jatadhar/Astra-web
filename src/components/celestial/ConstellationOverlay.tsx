'use client';

import { useZenithStore } from '@/hooks/useZenithStore';

const CONSTELLATION_STARS: Record<string, string> = {
  Orion: 'Betelgeuse, Rigel, Bellatrix, Mintaka, Alnilam, Alnitak',
  'Ursa Major': 'Dubhe, Merak, Phecda, Megrez, Alioth, Mizar, Alkaid',
  'Ursa Minor': 'Polaris, Kochab, Pherkad',
  Scorpius: 'Antares, Shaula, Sargas, Dschubba',
  Leo: 'Regulus, Denebola, Algieba',
  Cygnus: 'Deneb, Albireo, Sadr',
  Cassiopeia: 'Schedar, Caph, Gamma Cas, Ruchbah',
  Gemini: 'Pollux, Castor, Alhena',
  Taurus: 'Aldebaran, Elnath, Alcyone',
  Virgo: 'Spica, Porrima, Vindemiatrix',
  Sagittarius: 'Kaus Australis, Nunki, Ascella',
  Perseus: 'Mirfak, Algol, Zeta Per',
};

export default function ConstellationOverlay() {
  const { celestialBodies } = useZenithStore();
  const constellations = celestialBodies
    .filter((b) => b.type === 'constellation')
    .sort((a, b) => b.altitude - a.altitude);

  if (constellations.length === 0) return null;

  const visible = constellations.filter((c) => c.altitude > 0);
  const rising = constellations.filter((c) => c.altitude > -10 && c.altitude <= 0);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xs text-yellow-400 tracking-widest">CONSTELLATION MAP</h2>
        <div className="flex gap-2">
          <LegendDot color="bg-yellow-400" label="Visible" />
          <LegendDot color="bg-yellow-400/40" label="Rising" />
          <LegendDot color="bg-starlight/20" label="Below horizon" />
        </div>
      </div>
      <div className="panel-rule mb-4" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {constellations.map((c) => (
          <ConstellationCard key={c.name} constellation={c} />
        ))}
      </div>

      {visible.length > 0 && (
        <p className="font-mono text-[10px] text-starlight/30 mt-4 text-center">
          {visible.length} constellation{visible.length !== 1 ? 's' : ''} above the horizon ·{' '}
          {rising.length} rising
        </p>
      )}
    </div>
  );
}

function ConstellationCard({ constellation }: {
  constellation: { name: string; altitude: number; azimuth: number; visible: boolean }
}) {
  const isAbove = constellation.altitude > 0;
  const isRising = constellation.altitude > -10 && constellation.altitude <= 0;

  const azDir = azimuthToDirection(constellation.azimuth);

  return (
    <div className={`rounded-lg p-3 border transition-all ${
      isAbove
        ? 'border-yellow-400/25 bg-yellow-400/5'
        : isRising
        ? 'border-yellow-400/10 bg-yellow-400/3 opacity-60'
        : 'border-starlight/5 opacity-30'
    }`}>
      <div className="flex items-start justify-between mb-1">
        <span className="font-display text-[11px] text-starlight font-medium leading-tight">
          {constellation.name}
        </span>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${
          isAbove ? 'bg-yellow-400' : isRising ? 'bg-yellow-400/50' : 'bg-starlight/15'
        }`} />
      </div>
      <div className="font-mono text-[9px] text-starlight/40 space-y-0.5">
        <div>Alt: <span className="text-yellow-400/80">{constellation.altitude.toFixed(1)}°</span></div>
        <div>Az: <span className="text-yellow-400/80">{constellation.azimuth.toFixed(1)}° {azDir}</span></div>
      </div>
      {CONSTELLATION_STARS[constellation.name] && (
        <div className="mt-1.5 font-mono text-[8px] text-starlight/25 leading-tight truncate">
          {CONSTELLATION_STARS[constellation.name].split(', ').slice(0, 2).join(', ')}…
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="font-mono text-[9px] text-starlight/40">{label}</span>
    </div>
  );
}

function azimuthToDirection(az: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(az / 45) % 8];
}
