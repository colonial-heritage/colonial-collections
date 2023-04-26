import {useTranslations} from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return <h1>{t('title')}</h1>;
}
