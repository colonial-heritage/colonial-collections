import createIntlMiddleware from 'next-intl/middleware';

// Set the available locales here. These values should match a .json file in /messages.
// The const `locales` cannot be set dynamically based on files in /messages,
// because native Node.js APIs are not supported in Next.js middleware.
// So you can't read the filesystem.
export const locales = ['en', 'nl'];

// The middleware intercepts requests to `/` and will redirect
// to one of the configured locales instead (e.g. `/en`).
// In the background a cookie is set that will remember the
// locale of the last page that the user has visited.
// The middleware furthermore passes the resolved locale
// to components in your app.
export default createIntlMiddleware({
  locales,
  defaultLocale: 'en',
});

export const config = {
  // Skip all internal paths
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
