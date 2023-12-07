import createIntlMiddleware from 'next-intl/middleware';
import {locales} from './navigation';

// The middleware intercepts requests to `/` and will redirect
// to one of the configured locales instead (e.g. `/en`).
// In the background a cookie is set that will remember the
// locale of the last page that the user has visited.
// The middleware furthermore passes the resolved locale
// to components.
export default createIntlMiddleware({
  locales,
  defaultLocale: 'en',
});

export const config = {
  // Skip all internal paths
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
