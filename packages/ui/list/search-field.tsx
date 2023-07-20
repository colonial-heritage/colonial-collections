'use client';

import {useListStore} from '@colonial-collections/list-store';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';

export function SearchField() {
  const {query, queryChange} = useListStore();
  const t = useTranslations('Filters');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryChange(e.target.value);
  };

  return (
    <div className="w-full max-w-[450px] relative" id="facets">
      <label htmlFor="search" className="font-semibold">
        {t('search')}
      </label>
      <div className="flex flex-row w-full">
        <input
          data-testid="searchQuery"
          value={query}
          onChange={handleQueryChange}
          type="text"
          name="search"
          id="search"
          className="py-1 px-3 w-full rounded-l border border-neutral-700"
          aria-label={t('accessibilityTypeToFilter')}
        />
        <button
          className="bg-neutral-700 py-1 px-3 rounded-r border-t  border-b border-r border-neutral-700"
          aria-label="Click to search"
          value="amster"
        >
          <MagnifyingGlassIcon className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
