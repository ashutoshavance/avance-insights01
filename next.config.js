/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.strapi.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/surveys/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://kf.kobotoolbox.org https://ee.kobotoolbox.org;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
