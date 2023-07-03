import createIntlMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';
import {authMiddleware} from '@clerk/nextjs';

// Set the available locales here. These values should match a .json file in /messages.
// The const `locales` cannot be set dynamically based on files in /messages,
// because native Node.js APIs are not supported in Next.js middleware.
// So you can't read the filesystem.
export const locales = ['en', 'nl'];

export const config = {
  // Skip all internal paths
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
});

export default authMiddleware({
  beforeAuth: req => {
    return intlMiddleware(req);
  },

  publicRoutes: ['/', '/:locale', '/:locale/sign-in', '/:locale/sign-up'],
});
