'use client';

import {
  HeritageObjectCard,
  HeritageObjectListItem,
} from './heritage-object-card';
import {useTranslations} from 'next-intl';
import {HeritageObjectSearchResult} from '@colonial-collections/api';
import {useListStore} from '@colonial-collections/list-store';

interface Props {
  heritageObjects: HeritageObjectSearchResult['heritageObjects'];
  totalCount: HeritageObjectSearchResult['totalCount'];
}

export default function HeritageObjectList({
  heritageObjects,
  totalCount,
}: Props) {
  const t = useTranslations('ObjectSearchResults');
  const view = useListStore(s => s.view);
  const imageFetchMode = useListStore(s => s.imageFetchMode);
  const loading = useListStore(s => s.newDataNeeded);

  if (totalCount > 0) {
    if (view === 'grid') {
      return (
        <div className="columns-2 gap-6 lg:columns-3 xl:columns-4 2xl:columns-5 mt-6 *:break-inside-avoid relative">
          {heritageObjects.map(heritageObject => (
            <HeritageObjectCard
              key={heritageObject.id}
              heritageObject={heritageObject}
              imageFetchMode={imageFetchMode!}
            />
          ))}
          <LoadingOverlay loading={loading} />
        </div>
      );
    } else {
      return (
        <div className="flex-col flex relative">
          <div className="flex flex-col mt-6 w-full">
            {heritageObjects.map(heritageObject => (
              <HeritageObjectListItem
                key={heritageObject.id}
                heritageObject={heritageObject}
                imageFetchMode={imageFetchMode!}
              />
            ))}
          </div>
          <LoadingOverlay loading={loading} />
        </div>
      );
    }
  }

  return <div data-testid="no-results">{t('noResults')}</div>;
}

function LoadingOverlay({loading}: {loading: boolean}) {
  return loading ? (
    <div className="absolute inset-0 bg-white opacity-70 z-50"></div>
  ) : null;
}
