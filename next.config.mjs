/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable HTTPS for development
  experimental: {
    https: {
      key: './certs/cert.key',
      cert: './certs/cert.crt',
    },
  },
}

export default nextConfig
