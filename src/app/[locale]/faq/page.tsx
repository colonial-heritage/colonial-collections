import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

export default function Faq() {
  const t = useTranslations('Faq');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
    </PageHeader>
  );
}
