/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];

    // Prevent webpack from splitting astronomy-engine into a separate chunk
    // that fails to load. Bundle it inline with the page chunk instead.
    if (!isServer) {
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /astronomy-engine/,
        sideEffects: true,
      });

      // Ensure astronomy-engine is not split into a separate async chunk
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        astronomyEngine: {
          test: /[\\/]node_modules[\\/]astronomy-engine[\\/]/,
          name: 'astronomy-engine',
          chunks: 'all',
          priority: 30,
        },
      };
    }

    return config;
  },
  images: {
    domains: ['tile.openstreetmap.org'],
  },
  env: {
    NEXT_PUBLIC_ISS_API_URL: 'https://api.wheretheiss.at/v1/satellites/25544',
    NEXT_PUBLIC_CELESTRAK_BASE: 'https://celestrak.org/SOCRATES/query.php',
  },
  // Increase static generation timeout for slow networks
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
