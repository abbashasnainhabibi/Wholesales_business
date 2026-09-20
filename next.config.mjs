/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'videos.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: 'tahirasyndicate.com',
      },
      {
        protocol: 'https',
        hostname: 'office.tahirasyndicate.com',
      },
    ],
  },

  async headers() {
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://images.unsplash.com https://videos.pexels.com https://tahirasyndicate.com https://office.tahirasyndicate.com https://*.openstreetmap.org https://*.tile.openstreetmap.org https://maps.gstatic.com https://*.googleapis.com https://maps.google.com ${isProd ? '' : 'http://localhost:* http://127.0.0.1:*'};
      media-src 'self' https://videos.pexels.com https://tahirasyndicate.com https://office.tahirasyndicate.com ${isProd ? '' : 'http://localhost:* http://127.0.0.1:*'};
      font-src 'self' data:;
      connect-src 'self' https://tahirasyndicate.com https://office.tahirasyndicate.com https://challenges.cloudflare.com ${isProd ? '' : 'http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*'};
      frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://maps.google.com https://www.openstreetmap.org;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self' https://wa.me;
    `.replace(/\s{2,}/g, ' ').trim()

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      ...(isProd
        ? [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ]
        : []),
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ]

    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Restrict API route access
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isProd ? (process.env.NEXT_PUBLIC_SITE_URL || 'https://tahirasyndicate.com') : '*',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

export default nextConfig

