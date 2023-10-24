/**
 * @type {import('next').NextConfig}
 */

import NextIntlPlugin from 'next-intl/plugin';
import MDXPlugin from '@next/mdx';

const withNextIntl = NextIntlPlugin('./src/i18n.ts');
const withMDX = MDXPlugin();

const nextConfig = {
  transpilePackages: ['ui'],
  experimental: {
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

export default withNextIntl(withMDX(nextConfig));
