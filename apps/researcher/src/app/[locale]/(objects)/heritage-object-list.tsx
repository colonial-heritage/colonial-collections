import HeritageObjectCard from './heritage-object-card';
import {useTranslations} from 'next-intl';
import {SearchResult} from '@/lib/objects';

interface Props {
  heritageObjects: SearchResult['heritageObjects'];
  totalCount: SearchResult['totalCount'];
}

export default function HeritageObjectList({
  heritageObjects,
  totalCount,
}: Props) {
  const t = useTranslations('Home');

  if (totalCount > 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6">
        {heritageObjects.map(heritageObject => (
          <HeritageObjectCard
            key={heritageObject.id}
            heritageObject={heritageObject}
          />
        ))}
      </div>
    );
  }

  return <div data-testid="no-results">{t('noResults')}</div>;
}
