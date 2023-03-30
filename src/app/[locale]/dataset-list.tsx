import DatasetCard from './dataset-card';
import {useTranslations} from 'next-intl';
import {SearchResult} from '@/lib/dataset-fetcher';

interface Props {
  datasets: SearchResult['datasets'];
  totalCount: SearchResult['totalCount'];
}

export default function DatasetList({datasets, totalCount}: Props) {
  const t = useTranslations('Home');

  if (totalCount && totalCount > 0) {
    return (
      <>
        {datasets.map(dataset => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </>
    );
  }

  return <div data-testid="no-results">{t('noResults')}</div>;
}
