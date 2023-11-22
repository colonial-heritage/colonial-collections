'use client';

import {useListStore} from '@colonial-collections/list-store';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';

export function SearchField({placeholder = ''}: {placeholder?: string}) {
  const query = useListStore(s => s.query);
  const queryChange = useListStore(s => s.queryChange);
  const t = useTranslations('SearchField');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryChange(e.target.value);
  };

  return (
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
        placeholder={placeholder}
      />
      <button
        className="bg-neutral-700 py-1 px-3 rounded-r border-t  border-b border-r border-neutral-700"
        aria-label={t('accessibilityClickToSearch')}
      >
        <MagnifyingGlassIcon className="w-4 h-4 fill-white" />
      </button>
    </div>
  );
}

function Label() {
  const t = useTranslations('SearchField');

  return (
    <label htmlFor="search" className="font-semibold">
      {t('search')}
    </label>
  );
}

export function SearchFieldWithLabel() {
  return (
    <div className="w-full max-w-[450px] relative" id="facets">
      <Label />
      <SearchField />
    </div>
  );
}
