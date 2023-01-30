import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

interface DetailsProps {
  params: {id: string};
}

export default function Details({params: {id: encodedId}}: DetailsProps) {
  const id = decodeURIComponent(encodedId);
  const t = useTranslations('Details');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
      <p>{id}</p>
    </PageHeader>
  );
}
