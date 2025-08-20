/** @type {import('next').NextConfig} */
const nextConfig = {
  // Improve Windows file system compatibility
  experimental: {
    forceSwcTransforms: true,
    // Remove windowsFilePath as it's causing issues
  },
  
  // Production optimizations for Netlify  
  // Using static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // File system optimizations for Windows
  generateBuildId: async () => {
    // Use timestamp to avoid caching issues - force cache bust for infinite loop fix
    return `build-infinite-loop-fix-${Date.now()}`
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