/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  // Enable standalone output for Docker/Railway deployment
  output: 'standalone',
};

export default nextConfig;
