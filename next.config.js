/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  
  // Handle dynamic routes during export
  trailingSlash: true,
  
  // Improve Windows file system compatibility
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Production optimizations for Netlify  
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // File system optimizations for Windows
  generateBuildId: async () => {
    // FIXED PLACEMENT - Couple compatibility keys now in correct dimensions object
    return `translation-FIXED-PLACEMENT-${Date.now()}`
  },
  
  // Reduce build cache issues
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Better error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Shorter cache
    pagesBufferLength: 2       // Fewer cached pages
  },
  
  // Webpack configuration for Windows stability
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // More aggressive file watching for Windows
      config.watchOptions = {
        poll: 500,              // Faster polling
        aggregateTimeout: 200,  // Shorter timeout
        ignored: [
          '**/node_modules/**',
          '**/.next/**', 
          '**/.git/**',
          '**/dist/**',
          '**/functions/**'
        ]
      };
      
      // Prevent cache corruption
      config.cache = false;
      
      // Better error handling
      config.stats = {
        errors: true,
        warnings: true,
        builtAt: false,
        modules: false
      };
    }
    
    // Fix potential module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
}

module.exports = nextConfig