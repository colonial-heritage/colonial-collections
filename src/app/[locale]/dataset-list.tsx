import DatasetCard from './dataset-card';
import {useTranslations} from 'next-intl';
import {SearchResult} from '@/lib/dataset-fetcher';

export enum Sort {
  RelevanceDesc = 'relevanceDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export const defaultSort = Sort.RelevanceDesc;

interface Props {
  datasets: SearchResult['datasets'];
  totalCount: SearchResult['totalCount'];
}

export default function DatasetList({datasets, totalCount}: Props) {
  const t = useTranslations('Home');

  if (totalCount && totalCount > 0) {
    return (
      <>
        <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {datasets.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </>
    );
  }

  return <div data-testid="no-results">{t('noResults')}</div>;
}
