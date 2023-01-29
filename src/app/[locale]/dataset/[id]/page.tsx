import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

export default function Details() {
  const t = useTranslations('Details');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
    </PageHeader>
  );
}
