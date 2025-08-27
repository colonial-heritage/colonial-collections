// @ts-check

import createNextIntlPlugin from 'next-intl/plugin';
import MDXPlugin from '@next/mdx';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const withMDX = MDXPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@colonial-collections/ui'],
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
  redirects: async () => [
    {
      source: '/:locale/research-guide',
      destination: '/:locale/research-aids',
      permanent: true,
    },
    {
      source: '/:locale/research-guide/:id',
      destination: '/:locale/research-aids/:id',
      permanent: true,
    },
  ],
};

export default withNextIntl(withMDX(nextConfig));
