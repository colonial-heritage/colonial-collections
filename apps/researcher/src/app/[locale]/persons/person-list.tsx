import PersonCard from './person-card';
import {useTranslations} from 'next-intl';
import {SearchResult} from '@/lib/persons';

interface Props {
  persons: SearchResult['persons'];
  totalCount: SearchResult['totalCount'];
}

export default function PersonList({persons, totalCount}: Props) {
  const t = useTranslations('Home');

  if (totalCount > 0) {
    return (
      <>
        {persons.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
      </>
    );
  }

  return <div data-testid="no-results">{t('noResults')}</div>;
}
