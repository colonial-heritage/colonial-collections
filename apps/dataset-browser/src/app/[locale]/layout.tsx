import '../globals.css';
import {ReactNode} from 'react';
import Navigation from './navigation';
import {NextIntlClientProvider, useMessages, useTranslations} from 'next-intl';
import {WipMessage} from '@colonial-collections/ui';
import {ListProvider, defaultSortBy} from '@colonial-collections/list-store';
import {Link} from '@/navigation';

interface Props {
  children: ReactNode;
  params: {locale: string};
}

export default function RootLayout({children, params: {locale}}: Props) {
  const messages = useMessages();

  const t = useTranslations('ScreenReaderMenu');

  return (
    <html className="h-full" lang={locale}>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <WipMessage Link={Link} />
          <div className="sr-only">
            <ul>
              <li>
                <a href="#facets">{t('jumpFilters')}</a>
              </li>
              <li>
                <a href="#search-results">{t('jumpResults')}</a>
              </li>
              <li>
                <a href="#page-navigation">{t('jumpNavigation')}</a>
              </li>
            </ul>
          </div>
          <header className="px-4 py-4 md:px-8 bg-consortium-blue-900 text-white">
            <Navigation />
          </header>
          <main className="bg-white pb-32">
            <div className="max-w-7xl container mx-auto p-8">
              <ListProvider baseUrl="/" defaultSortBy={defaultSortBy}>
                {children}
              </ListProvider>
            </div>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
