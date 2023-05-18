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
      <>
        {heritageObjects.map(heritageObject => (
          <HeritageObjectCard
            key={heritageObject.id}
            heritageObject={heritageObject}
          />
        ))}
      </>
    );
  }

  return <div data-testid="no-results">{t('noResults')}</div>;
}
