/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable automatic static optimization to prevent Pages Router error page generation
  // This resolves conflicts between App Router and legacy error pages
  experimental: {
    appDir: false, // Explicitly tell Next.js we're NOT using pages router
  },
};

module.exports = nextConfig;
