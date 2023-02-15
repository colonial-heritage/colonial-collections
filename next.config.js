/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = withNextIntl(nextConfig);
