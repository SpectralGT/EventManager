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

 webpack: (config) => {
    config.resolve.alias['@radix-ui/react-select'] = path.resolve(__dirname, 'node_modules/@radix-ui/react-accordion');
    return config;
  },

};

export default nextConfig;
