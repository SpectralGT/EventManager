import type { NextConfig } from "next";
const path = require('path');

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["as1.ftcdn.net"],
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },

  compilerOptions: {
    moduleResolution: "Bundler",
    module: "ESNext",
  }

};

export default nextConfig;
