import createIntlMiddleware from 'next-intl/middleware';
import {clerkMiddleware} from '@clerk/nextjs/server';
import {locales} from './navigation';
import {LocaleEnum} from '@/definitions';

export const config = {
  // Skip all internal paths
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

// This middleware intercepts requests to `/` and will redirect
// to one of the configured locales instead (e.g. `/en`).
// In the background a cookie is set that will remember the
// locale of the last page that the user has visited.
// The middleware furthermore passes the resolved locale
// to components.
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: LocaleEnum.En,
});

export default clerkMiddleware((auth, req) => {
  return intlMiddleware(req);
});
