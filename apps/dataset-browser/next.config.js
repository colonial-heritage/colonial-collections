/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');
const withMDX = require('@next/mdx')();

const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true,
  },
};

module.exports = withNextIntl(withMDX(nextConfig));
