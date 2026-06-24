'use client';

import { useMemo } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function StarField() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 3 + 1.5,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.7 + 0.2,
    }));
  }, []);

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Nebula glow blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '20%', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '60%', right: '15%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
