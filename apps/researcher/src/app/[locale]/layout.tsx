import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {ClerkProvider} from '@clerk/nextjs';
import {Metadata} from 'next';

interface Props {
  children: ReactNode;
  params: {locale: string};
}

export const metadata: Metadata = {
  title: 'Colonial Collections Datahub | Collonial Collecions Consortium',
};

export default async function RootLayout({children, params: {locale}}: Props) {
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
