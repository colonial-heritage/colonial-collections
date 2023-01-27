import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

export default function About() {
  const t = useTranslations('About');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
    </PageHeader>
  );
}
