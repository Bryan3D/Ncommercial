/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.naguabo-commercial.com' },
    ],
  },
  env: {
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '19393823332',
  },
};

module.exports = nextConfig;