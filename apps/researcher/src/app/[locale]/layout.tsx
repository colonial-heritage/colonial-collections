import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {ClerkProvider} from '@clerk/nextjs';
import {getTranslations} from 'next-intl/server';
import Navigation from '@/components/navigation';
import {WipMessage} from '@colonial-collections/ui';
import {Link} from '@/navigation';
import {env} from 'node:process';
import AuthHealthCheck from '@/lib/auth-health-check';
import Footer from '@/components/footer';

interface Props {
  children: ReactNode;
  params: {locale: string};
}

interface MetadataProps {
  params: {
    locale: string;
  };
}
export async function generateMetadata({params: {locale}}: MetadataProps) {
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {
    title: t('title'),
  };
}

export default async function RootLayout({children, params: {locale}}: Props) {
  const t = await getTranslations('ScreenReaderMenu');

  let messages;
  try {
    messages = (await import(`../../messages/${locale}/messages.json`)).default;
  } catch (err) {
    notFound();
  }

  const clerkLocale = (await import(`@/messages/${locale}/clerk`)).default;

  return (
    <ClerkProvider localization={clerkLocale}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <html lang={locale}>
        <body>
          <div className="min-h-screen flex flex-col">
            <AuthHealthCheck />
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
              <header className="w-full bg-consortium-blue-900 text-white py-2">
                <Navigation datasetBrowserUrl={env['DATASET_BROWSER_URL']!} />
              </header>
              {children}
              <Footer />
            </NextIntlClientProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
