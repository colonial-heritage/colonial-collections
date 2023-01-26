import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

export default function Register() {
  const t = useTranslations('Register');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
    </PageHeader>
  );
}
