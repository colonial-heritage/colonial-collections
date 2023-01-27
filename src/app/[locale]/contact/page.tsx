import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

export default function Contact() {
  const t = useTranslations('Contact');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
    </PageHeader>
  );
}
