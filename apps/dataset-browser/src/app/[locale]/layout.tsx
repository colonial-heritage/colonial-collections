import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import Navigation from './navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getTranslator} from 'next-intl/server';
import {locales} from '@/middleware';
import WipMessage from 'ui/wip-message';

interface Props {
  children: ReactNode;
  params: {locale: string};
}

export default async function RootLayout({children, params: {locale}}: Props) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}/messages.json`)).default;
  } catch (err) {
    notFound();
  }

  const t = await getTranslator(locale, 'ScreenReaderMenu');

  return (
    <html className="h-full" lang={locale}>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <WipMessage />
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
          <header className="max-w-7xl container mx-auto px-4 py-4 md:px-8 md:py-8">
            <Navigation locales={locales} />
          </header>
          <main className="bg-sand-50 pb-32">
            <div className="max-w-7xl container mx-auto p-8">{children}</div>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
