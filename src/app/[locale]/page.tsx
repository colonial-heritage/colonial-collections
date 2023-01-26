import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle, PageContent} from '@/components/page';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <>
      <PageHeader>
        <PageTitle>{t('title')}</PageTitle>
      </PageHeader>
      <PageContent>
        <h2>{t('description')}</h2>
      </PageContent>
    </>
  );
}
