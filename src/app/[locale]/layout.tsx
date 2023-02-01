import './globals.css';
import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import Navigation from '@/components/navigation';
import {useTranslations} from 'next-intl';
import LocaleSwitcher from '@/components/locale-switcher';
import Providers from '@/app/providers';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export default function RootLayout({children, params}: Props) {
  const locale = useLocale();

  // Show a 404 error for unknown locales
  if (params.locale !== locale) {
    notFound();
  }

  const t = useTranslations('Navigation');

  // The navigation is a client component, get the labels first in this server component
  // See: https://next-intl-docs.vercel.app/docs/next-13/server-components#switching-to-client-components
  const navigationLabels = {
    home: t('Home'),
    register: t('Register'),
    about: t('About'),
    faq: t('Faq'),
    contact: t('Contact'),
  };

  return (
    <html className="h-full" lang={locale}>
      <body className="flex flex-col min-h-screen">
        <div className="min-h-full">
          <Navigation navigationLabels={navigationLabels} locale={locale} />

          <div className="p-10">
            <Providers>{children}</Providers>
          </div>
        </div>
        <footer className="p-10 mt-auto">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 text-gray-400">
            <LocaleSwitcher />
          </div>
        </footer>
      </body>
    </html>
  );
}
