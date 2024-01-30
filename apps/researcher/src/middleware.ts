import createIntlMiddleware from 'next-intl/middleware';
import {authMiddleware} from '@clerk/nextjs';
import {locales, LocaleEnum} from './navigation';

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
const handleI18nRouting = createIntlMiddleware({
  locales,
  defaultLocale: LocaleEnum.En,
});

export default authMiddleware({
  beforeAuth(request) {
    // Store current request pathname in the request header,
    // this can be used to set the active menu/tab item.
    // See issue: https://github.com/vercel/next.js/issues/43704
    request.headers.set('x-pathname', request.nextUrl.pathname);

    const response = handleI18nRouting(request);

    return response;
  },
  publicRoutes: ['/', '/(.*)'],
});
