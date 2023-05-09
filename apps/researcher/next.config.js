/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');
const withMDX = require('@next/mdx')();

const nextConfig = {
  transpilePackages: ['ui'],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'images.memorix.nl',
      },
    ],
  },
};

module.exports = withNextIntl(withMDX(nextConfig));
