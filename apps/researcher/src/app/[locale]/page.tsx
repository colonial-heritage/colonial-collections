import {useTranslations} from 'next-intl';

// Revalidate the page
export const revalidate = 0;

export default function Home() {
  const t = useTranslations('Home');

  return <h1>{t('title')}</h1>;
}
