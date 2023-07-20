'use client';

import {useListStore, SortBy} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';

export function OrderSelector() {
  const t = useTranslations('Sort');
  const {sortBy, sortChange} = useListStore();

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
      <option value={SortBy.RelevanceDesc}>{t('sortRelevanceDesc')}</option>
      <option value={SortBy.NameAsc}>{t('sortNameAsc')}</option>
      <option value={SortBy.NameDesc}>{t('sortNameDesc')}</option>
    </select>
  );
}
