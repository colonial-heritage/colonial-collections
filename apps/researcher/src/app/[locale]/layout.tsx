import '../globals.css';
import {useLocale} from 'next-intl';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import Navigation from './navigation';
import {useTranslations} from 'next-intl';
import {locales} from '@/middleware';
import WipMessage from 'ui/wip-message';

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
  const tScreenReaderMenu = useTranslations('ScreenReaderMenu');

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
    <html className="h-full min-h-screen" lang={locale}>
      <body className="h-full min-h-screen">
        <WipMessage />
        <div className="sr-only">
          <ul>
            <li>
              <a href="#facets">{tScreenReaderMenu('jumpFilters')}</a>
            </li>
            <li>
              <a href="#search-results">{tScreenReaderMenu('jumpResults')}</a>
            </li>
            <li>
              <a href="#page-navigation">
                {tScreenReaderMenu('jumpNavigation')}
              </a>
            </li>
          </ul>
        </div>
        <div className="max-w-[1800px] mx-auto h-full min-h-screen flex flex-col justify-stretch items-stretch gap-8">
          <header className="w-full px-10 py-4 bg-neutral-50">
            <Navigation
              locale={locale}
              locales={locales}
              navigationLabels={navigationLabels}
              languageSelectorLabels={languageSelectorLabels}
              localeLabels={localeLabels}
            />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
