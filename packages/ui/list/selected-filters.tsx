'use client';

import {useTranslations} from 'next-intl';
import {Badge} from '../badge';
import {useListStore} from '@colonial-collections/list-store';
import {SearchResultFilter} from './SearchResultFilter';

interface Props {
  filters: {
    searchResultFilters: SearchResultFilter[];
    filterKey: string;
  }[];
}

interface ClearSelectedFilterProps {
  id: string;
  filterKey: string;
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

  function clearSelectedFilter({id, filterKey}: ClearSelectedFilterProps) {
    filterChange(
      filterKey,
      selectedFilters[filterKey]?.filter(filterId => id !== filterId) || []
    );
  }

  function clearQuery() {
    queryChange('');
  }

  function clearAllFilters() {
    clearQuery();
    filters.forEach(filter => filterChange(filter.filterKey, []));
  }

  return (
    <div className="mt-3 flex items-center">
      <h3 className="text-xs font-medium text-gray-500">{t('filters')}</h3>
      <div
        aria-hidden="true"
        className="hidden h-5 w-px bg-gray-300 sm:ml-3 sm:block mr-2"
      />
      <div className="flex flex-wrap grow">
        {filters.map(({searchResultFilters, filterKey}) => {
          const selectedFilter = selectedFilters[filterKey];
          return (
            !!selectedFilter?.length &&
            selectedFilter.map(id => (
              <Badge key={id} testId="selectedFilter">
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
        })}
        {query && (
          <Badge testId="selectedFilter">
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
