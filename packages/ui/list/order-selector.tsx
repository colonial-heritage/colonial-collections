'use client';

import {useListStore, SortBy} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';

const defaultValues = [SortBy.RelevanceDesc, SortBy.NameAsc, SortBy.NameDesc];

export function OrderSelector({values = defaultValues}: {values?: string[]}) {
  const t = useTranslations('Sort');
  const sortBy = useListStore(s => s.sortBy);
  const sortChange = useListStore(s => s.sortChange);

  function handleSortByChange(e: React.ChangeEvent<HTMLSelectElement>) {
    sortChange(e.target.value as SortBy);
  }

  return (
    <select
      name="location"
      className="text-consortiumBlue-800 rounded p-2 text-sm bg-consortiumBlue-50 pr-6"
      value={sortBy}
      onChange={handleSortByChange}
      aria-label={t('accessibilitySelectToChangeOrder')}
    >
      {values.map(value => (
        <option key={value} value={value}>
          {t(value)}
        </option>
      ))}
    </select>
  );
}
