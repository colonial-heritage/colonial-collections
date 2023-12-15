import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import Navigation from './navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/navigation';
import {WipMessage} from '@colonial-collections/ui';
import {ClerkProvider} from '@clerk/nextjs';

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

  const t = await getTranslations('ScreenReaderMenu');
  const clerkLocale = (await import(`@/messages/${locale}/clerk`)).default;

  return (
    <ClerkProvider localization={clerkLocale}>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
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
            <div className="mx-auto h-full min-h-screen flex flex-col justify-stretch items-stretch ">
              <header className="w-full bg-consortiumBlue-900 text-white py-2">
                <Navigation />
              </header>
              {children}
            </div>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
