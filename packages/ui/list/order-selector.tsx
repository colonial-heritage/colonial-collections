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
      className="mt-1 block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
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
