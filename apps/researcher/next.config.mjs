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
  // https://vercel.com/docs/image-optimization
  images: {
    remotePatterns: [{hostname: '**'}],
    // https://nextjs.org/docs/app/api-reference/components/image#minimumcachettl
    minimumCacheTTL: 31_536_000, // 1 year
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [80, 90, 120, 160, 270, 360],
    formats: ['image/avif', 'image/webp'],
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
