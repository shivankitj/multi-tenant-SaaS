// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma ko Next.js server ke bundle ke bahar rakhna
  serverExternalPackages: ['@prisma/client'],

  // Enable CORS for all API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
