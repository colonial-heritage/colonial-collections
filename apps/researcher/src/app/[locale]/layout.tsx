import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {ClerkProvider} from '@clerk/nextjs';
import {getTranslations} from 'next-intl/server';

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
  const t = await getTranslations('Meta');

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
