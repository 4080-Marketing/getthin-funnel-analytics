/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Disable static optimization for all pages
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
