import {SearchResultFilter} from '@/lib/dataset-fetcher';
import {Dispatch} from 'react';
import {useTranslations} from 'next-intl';
import {XMarkIcon} from '@heroicons/react/24/solid';

interface TagProps {
  name?: string;
  remove: () => void;
}

function Tag({name, remove}: TagProps) {
  return (
    <span className="flex items-center" data-test="selectedFilterTag">
      <span className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-gray-900">
        <span>{name}</span>
        <button
          data-test="removeSelectedFilter"
          type="button"
          className="ml-1 inline-flex flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
          onClick={remove}
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </span>
    </span>
  );
}

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

interface RemoveListItem {
  id: string;
  selectedFilters: string[];
  setSelectedFilters: Dispatch<string[]>;
}

export default function SelectedFilters({filters, query}: Props) {
  const t = useTranslations('Home');

  function removeListItem({
    id,
    selectedFilters,
    setSelectedFilters,
  }: RemoveListItem) {
    setSelectedFilters(selectedFilters.filter(filterId => id !== filterId));
  }
  function removeQuery() {
    query.setQuery('');
  }

  function clearAllFilters() {
    removeQuery();
    filters.forEach(filter => {
      filter.setSelectedFilters([]);
    });
  }

  if (
    !query.value &&
    !filters.filter(filter => filter.selectedFilters.length).length
  ) {
    return null;
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
              <Tag
                key={id}
                name={
                  searchResultFilters.find(
                    searchResultFilter => searchResultFilter.id === id
                  )?.name
                }
                remove={() =>
                  removeListItem({
                    id,
                    selectedFilters: selectedFilters,
                    setSelectedFilters: setSelectedFilters,
                  })
                }
              />
            ))
        )}
        {query.value && <Tag remove={removeQuery} name={query.value} />}
      </div>
      <button
        type="button"
        className="whitespace-nowrap inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={clearAllFilters}
      >
        {t('clearAllFilters')}
      </button>
    </div>
  );
}
