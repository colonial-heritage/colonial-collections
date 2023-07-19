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
  } catch (error) {
    notFound();
  }

  const t = await getTranslator(locale, 'ScreenReaderMenu');

  return (
    <html className="h-full min-h-screen" lang={locale}>
      <body className="h-full min-h-screen">
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
          <div className="max-w-[1800px] mx-auto h-full min-h-screen flex flex-col justify-stretch items-stretch gap-8 pb-40">
            <header className="w-full px-10 py-4 bg-neutral-50">
              <Navigation locales={locales} />
            </header>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
