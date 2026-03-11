/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/*', 'lucide-react'],
  },
};

module.exports = nextConfig;
