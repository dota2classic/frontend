import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.fastly.steamstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net'
      },
      {
        protocol: 'https',
        hostname: 's3.dotaclassic.ru'
      }
    ]
  },
  sassOptions: {
    silednceDeprecations: ['legacy-js-api'],
  },
  reactStrictMode: false,
  output: "standalone",
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.SOCKET_URL,

    IS_DEV_VERSION: process.env.IS_DEV_VERSION,
    NEXT_PUBLIC_IS_DEV_VERSION: process.env.IS_DEV_VERSION,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
  },
  experimental: {
    scrollRestoration: true,
    fallbackNodePolyfills: false
  }
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig);
