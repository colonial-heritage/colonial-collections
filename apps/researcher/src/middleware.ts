import createIntlMiddleware from 'next-intl/middleware';
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

export default authMiddleware({
  beforeAuth(request) {
    // This middleware intercepts requests to `/` and will redirect
    // to one of the configured locales instead (e.g. `/en`).
    // In the background a cookie is set that will remember the
    // locale of the last page that the user has visited.
    // The middleware furthermore passes the resolved locale
    // to components.
    const handleI18nRouting = createIntlMiddleware({
      locales,
      defaultLocale: 'en',
    });

    // Store current request pathname in the request header,
    // this can be used to set the active menu/tab item.
    // See issue: https://github.com/vercel/next.js/issues/43704
    request.headers.set('x-pathname', request.nextUrl.pathname);

    const response = handleI18nRouting(request);

    return response;
  },
  publicRoutes: ['/', '/(.*)'],
  debug: true,
});
