import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
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

  const clerkLocale = (await import(`@/messages/${locale}/clerk`)).default;

  return (
    <ClerkProvider localization={clerkLocale}>
      <html lang={locale}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
