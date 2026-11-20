import bundleAnalyzer from "@next/bundle-analyzer";

const PUBLIC_MEDIA_PATH =
  "/:path((?!_next/).+\\.(?:webp|png|jpe?g|gif|svg|webm|mp4|mp3|wav))";

const PUBLIC_MEDIA_CACHE_CONTROL = "private, max-age=86400";

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: PUBLIC_MEDIA_PATH,
      headers: [{ key: "Cache-Control", value: PUBLIC_MEDIA_CACHE_CONTROL }],
    },
  ],
  compress: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  reactStrictMode: false,
  output: "standalone",
  env: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    IS_DEV_VERSION: process.env.IS_DEV_VERSION,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
  },
  experimental: {
    scrollRestoration: true,
    fallbackNodePolyfills: true,
  },
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
    };
    config.output.pathinfo = false;

    return config;
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
