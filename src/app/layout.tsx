import type { Metadata } from 'next';
import '../styles/globals.css';
import StarField from '@/components/ui/StarField';

export const metadata: Metadata = {
  title: 'Project Zenith: The Celestial Eye',
  description: 'Real-time cosmic radar — track the ISS, satellites, planets, and constellations above any location on Earth.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Project Zenith: The Celestial Eye',
    description: 'Real-time cosmic radar for any location on Earth.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void text-starlight antialiased">
        <StarField />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
