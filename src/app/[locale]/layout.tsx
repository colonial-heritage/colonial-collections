import './globals.css';
import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import Navigation from '@/components/navigation';
import {useTranslations} from 'next-intl';
import {locales} from '@/middleware';

interface Props {
  children: ReactNode;
  params: {locale: string};
}

export default function RootLayout({children, params}: Props) {
  const locale = useLocale();

  // Show a 404 error for unknown locales
  if (params.locale !== locale) {
    notFound();
  }

  const tNavigation = useTranslations('Navigation');
  const tLanguageSelector = useTranslations('LanguageSelector');

  // The navigation is a client component, get the labels first in this server component
  // See: https://next-intl-docs.vercel.app/docs/next-13/server-components#switching-to-client-components
  const navigationLabels = {
    name: tNavigation('name'),
    home: tNavigation('home'),
    about: tNavigation('about'),
    faq: tNavigation('faq'),
    contact: tNavigation('contact'),
  };

  const languageSelectorLabels = {
    accessibilityOpenMenu: tLanguageSelector('accessibilityOpenMenu'),
    accessibilityLanguageSelector: tLanguageSelector(
      'accessibilityLanguageSelector',
      {
        language: tLanguageSelector(`${locale}`),
      }
    ),
  };

  const localeLabels: {[locale: string]: string} = {};

  locales.forEach(locale => {
    localeLabels[locale] = tLanguageSelector(`${locale}`);
  });

  return (
    <html className="h-full" lang={locale}>
      <body className="flex flex-col min-h-screen">
        <header className="max-w-7xl container mx-auto px-4 py-4 md:px-8 md:py-8">
          <Navigation
            navigationLabels={navigationLabels}
            languageSelectorLabels={languageSelectorLabels}
            localeLabels={localeLabels}
            locale={locale}
          />
        </header>
        <main className="bg-gray-light">
          <div className="max-w-7xl container mx-auto p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
