import {useTranslations} from 'next-intl';
import {PageHeader, PageTitle} from '@/components/page';

interface Props {
  params: {id: string};
}

export default function Details(props: Props) {
  const id = decodeURIComponent(props.params.id);
  const t = useTranslations('Details');

  return (
    <PageHeader>
      <PageTitle>{t('title')}</PageTitle>
      <p>{id}</p>
    </PageHeader>
  );
}
