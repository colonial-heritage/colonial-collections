import DatasetCard from './dataset-card';
import {useTranslations} from 'next-intl';
import type {DatasetSearchResult} from '@colonial-collections/api';

interface Props {
  datasets: DatasetSearchResult['datasets'];
  totalCount: DatasetSearchResult['totalCount'];
}

export default function DatasetList({datasets, totalCount}: Props) {
  const t = useTranslations('Home');

  if (totalCount > 0) {
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
