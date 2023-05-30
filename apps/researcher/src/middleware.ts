import createIntlMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';

// Set the available locales here. These values should match a .json file in /messages.
// The const `locales` cannot be set dynamically based on files in /messages,
// because native Node.js APIs are not supported in Next.js middleware.
// So you can't read the filesystem.
export const locales = ['en', 'nl'];

export const config = {
  // Skip all internal paths
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};

export default function middleware(request: NextRequest) {
  // This middleware intercepts requests to `/` and will redirect
  // to one of the configured locales instead (e.g. `/en`).
  // In the background a cookie is set that will remember the
  // locale of the last page that the user has visited.
  // The middleware furthermore passes the resolved locale
  // to components in your app.
  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
  });

  const response = handleI18nRouting(request);

  // Store current request pathname in the response header,
  // this can be used to set the active menu/tab item.
  // See issue: https://github.com/vercel/next.js/issues/43704
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}
