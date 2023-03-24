import {SearchResultFilter} from '@/lib/dataset-fetcher';
import {Dispatch} from 'react';
import {useTranslations} from 'next-intl';
import Badge from '@/components/badge';

interface Props {
  filters: {
    searchResultFilters: SearchResultFilter[];
    selectedFilters: string[];
    setSelectedFilters: Dispatch<string[]>;
  }[];
  query: {
    value: string;
    setQuery: Dispatch<string>;
  };
}

interface ClearSelectedFilterProps {
  id: string;
  selectedFilters: string[];
  setSelectedFilters: Dispatch<string[]>;
}

export default function SelectedFilters({filters, query}: Props) {
  const t = useTranslations('Home');

  // Only show this component if there are active filters.
  if (
    !query.value &&
    !filters.filter(filter => filter.selectedFilters.length).length
  ) {
    return null;
  }

  function clearSelectedFilter({
    id,
    selectedFilters,
    setSelectedFilters,
  }: ClearSelectedFilterProps) {
    setSelectedFilters(selectedFilters.filter(filterId => id !== filterId));
  }

  function clearQuery() {
    query.setQuery('');
  }

  function clearAllFilters() {
    clearQuery();
    filters.forEach(filter => filter.setSelectedFilters([]));
  }

  return (
    <div className="mt-3 flex items-center">
      <h3 className="text-xs font-medium text-gray-500">{t('filters')}</h3>
      <div
        aria-hidden="true"
        className="hidden h-5 w-px bg-gray-300 sm:ml-3 sm:block mr-2"
      />
      <div className="flex flex-wrap grow">
        {filters.map(
          ({selectedFilters, searchResultFilters, setSelectedFilters}) =>
            !!selectedFilters.length &&
            selectedFilters.map(id => (
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
                      selectedFilters: selectedFilters,
                      setSelectedFilters: setSelectedFilters,
                    })
                  }
                />
              </Badge>
            ))
        )}
        {query.value && (
          <Badge testId="selectedFilter">
            {query.value}
            <Badge.Action onClick={clearQuery} />
          </Badge>
        )}
      </div>
      <button
        type="button"
        className="whitespace-nowrap inline-flex items-center rounded border border-transparent bg-sky-100 px-2.5 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        onClick={clearAllFilters}
      >
        {t('clearAllFilters')}
      </button>
    </div>
  );
}
