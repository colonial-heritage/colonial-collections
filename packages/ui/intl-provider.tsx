import {NextIntlClientProvider} from 'next-intl';
import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  locale: string;
}

export async function IntlProvider({children, locale}: Props) {
  const messages = (await import(`./messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
