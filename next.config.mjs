/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.API_URL,
  }
};

export default nextConfig;
