/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do NOT use output: "standalone" for Cloudflare Pages
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
