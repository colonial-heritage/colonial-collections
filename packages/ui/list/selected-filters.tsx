'use client';

import {useTranslations} from 'next-intl';
import {Badge} from '../badge';
import {useListStore} from '@colonial-collections/list-store';
import {SearchResultFilter} from './SearchResultFilter';
import {MagnifyingGlassIcon, TagIcon} from '@heroicons/react/24/solid';

interface Props {
  filters: {
    searchResultFilters: SearchResultFilter[];
    filterKey: string;
  }[];
}

interface ClearSelectedFilterProps {
  id: string | number;
  filterKey: string;
}

interface SelectedFiltersForKeyProps {
  searchResultFilters: SearchResultFilter[];
  filterKey: string;
}

export function SelectedFiltersForKey({
  searchResultFilters,
  filterKey,
}: SelectedFiltersForKeyProps) {
  const {selectedFilters, filterChange} = useListStore();
  const selectedFilter = selectedFilters[filterKey];

  function clearSelectedFilter({id, filterKey}: ClearSelectedFilterProps) {
    filterChange(
      filterKey,
      selectedFilters[filterKey]?.filter(filterId => id !== filterId) || []
    );
  }

  return (
    !!selectedFilter?.length &&
    selectedFilter.map(id => (
      <Badge key={id} testId="selectedFilter">
        <Badge.Icon Icon={TagIcon} />
        {
          searchResultFilters.find(
            searchResultFilter => searchResultFilter.id === id
          )!.name
        }
        <Badge.Action
          onClick={() =>
            clearSelectedFilter({
              id,
              filterKey,
            })
          }
        />
      </Badge>
    ))
  );
}

export function SelectedFilters({filters}: Props) {
  const t = useTranslations('Filters');
  const {query, selectedFilters, filterChange, queryChange} = useListStore();

  // Only show this component if there are active filters.
  if (
    !query &&
    !filters.filter(filter => selectedFilters[filter.filterKey]?.length).length
  ) {
    return null;
  }

  function clearQuery() {
    queryChange('');
  }

  function clearAllFilters() {
    clearQuery();
    filters.forEach(filter => filterChange(filter.filterKey, []));
  }

  return (
    <div className="flex flex-row items-center gap-2 mb-6 py-6 flex-wrap border-b">
      <h3 className="text-sm text-neutral-500">{t('filters')}</h3>
      <div className="grow flex flex-row items-center gap-2">
        {filters.map(({searchResultFilters, filterKey}) => (
          <SelectedFiltersForKey
            key={filterKey}
            searchResultFilters={searchResultFilters}
            filterKey={filterKey}
          />
        ))}
        {query && (
          <Badge testId="selectedFilter">
            <Badge.Icon Icon={MagnifyingGlassIcon} />
            {query}
            <Badge.Action onClick={clearQuery} />
          </Badge>
        )}
      </div>
      <button
        type="button"
        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={clearAllFilters}
      >
        {t('clearAllFilters')}
      </button>
    </div>
  );
}
