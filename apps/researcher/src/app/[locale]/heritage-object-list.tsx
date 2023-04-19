import HeritageObjectCard from './heritage-object-card';
import {useTranslations} from 'next-intl';
import {SearchResult} from '@/lib/heritage-fetcher';

interface Props {
  heritageObjects: SearchResult['heritageObjects'];
  totalCount: SearchResult['totalCount'];
}

export default function HeritageObjectList({
  heritageObjects,
  totalCount,
}: Props) {
  const t = useTranslations('Home');

  if (totalCount && totalCount > 0) {
    return (
      <div className="w-full md:w-2/3 gap-6 flex flex-col">
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
