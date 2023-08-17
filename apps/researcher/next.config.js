/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');
const withMDX = require('@next/mdx')();

const nextConfig = {
  transpilePackages: ['ui'],
  experimental: {
    appDir: true,
    mdxRs: true,
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
};

module.exports = withNextIntl(withMDX(nextConfig));
