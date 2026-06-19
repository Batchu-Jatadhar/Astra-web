/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
  images: {
    domains: ['tile.openstreetmap.org'],
  },
  env: {
    NEXT_PUBLIC_OPENNOTIFY_ISS_URL: 'http://api.open-notify.org/iss-now.json',
    NEXT_PUBLIC_CELESTRAK_BASE: 'https://celestrak.org/SOCRATES/query.php',
  },
};

module.exports = nextConfig;
