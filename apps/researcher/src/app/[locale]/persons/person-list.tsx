import PersonCard from './person-card';
import {useTranslations} from 'next-intl';
import {ConstituentSearchResult} from '@colonial-collections/api';

interface Props {
  persons: ConstituentSearchResult['constituents'];
  totalCount: ConstituentSearchResult['totalCount'];
}

export default function PersonList({persons, totalCount}: Props) {
  const t = useTranslations('Constituents');

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
