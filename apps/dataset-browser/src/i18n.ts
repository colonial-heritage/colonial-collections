import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales} from './navigation';
import {LocaleEnum} from '@/definitions';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as LocaleEnum)) notFound();

  return {
    messages: (
      await (locale === 'en'
        ? // This will enable HMR for `en`
          import('./messages/en/messages.json')
        : import(`./messages/${locale}/messages.json`))
    ).default,
  };
});
