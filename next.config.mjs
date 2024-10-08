import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.API_URL,
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
