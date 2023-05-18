'use client';

import {useListStore} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';

export function SearchField() {
  const {query, queryChange} = useListStore();
  const t = useTranslations('Filters');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryChange(e.target.value);
  };

  return (
    <div className="pr-4 max-w-[350px]" id="facets">
      <label htmlFor="search" className="block font-semibold text-gray-900">
        {t('search')}
      </label>
      <input
        data-testid="searchQuery"
        value={query}
        onChange={handleQueryChange}
        type="text"
        name="search"
        id="search"
        className="block w-full rounded-md border-gray-300 px-4 shadow-sm focus:border-sky-700 focus:ring-sky-700 sm:text-sm"
        aria-label={t('accessibilityTypeToFilter')}
      />
    </div>
  );
}
