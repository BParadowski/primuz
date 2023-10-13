/** @type {import('next').NextConfig} */
// @ts-check
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

module.exports = withPWA(nextConfig);
