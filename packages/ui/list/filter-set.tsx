'use client';

import {useCallback, useState, useMemo, Dispatch} from 'react';
import {useTranslations} from 'next-intl';
import {
  useFloating,
  size,
  useDismiss,
  useInteractions,
} from '@floating-ui/react';
import {ChevronDoubleRightIcon} from '@heroicons/react/20/solid';
import {useListStore} from '@colonial-collections/list-store';
import {SearchResultFilter} from './SearchResultFilter';

const maxOptionsInColumn = 10;

interface Props {
  title: string;
  searchResultFilters: SearchResultFilter[];
  filterKey: string;
  testId?: string;
}

type FilterOptionProps = Pick<Props, 'title' | 'filterKey'> & {
  searchResultFilter: SearchResultFilter;
};

type HeaderProps = Pick<Props, 'title' | 'searchResultFilters'> & {
  setIsExpanded: Dispatch<React.SetStateAction<boolean>>;
  setQuery: Dispatch<React.SetStateAction<string>>;
  query: string;
};

function Header({
  searchResultFilters,
  title,
  setIsExpanded,
  query,
  setQuery,
}: HeaderProps) {
  const t = useTranslations('Filters');

  return (
    <>
      <legend className="block font-semibold text-gray-900">{title}</legend>
      {searchResultFilters.length > 5 && (
        <div className="flex items-center md:max-w-[350px] w-full">
          <input
            placeholder={t('filterSearchPlaceholder', {
              filterName: title.toLocaleLowerCase(),
            })}
            value={query}
            onChange={e => setQuery(e.target.value)}
            type="text"
            className="block rounded-md grow border-gray-300 px-4 py-1 shadow-sm focus:border-sky-700 focus:ring-sky-700 sm:text-sm"
          ></input>
          <button
            className="ml-3 inline-flex items-center text-sky-700"
            onClick={() =>
              setIsExpanded((isExpanded: boolean): boolean => !isExpanded)
            }
          >
            <span>{t('expandFilter')}</span>
            <ChevronDoubleRightIcon className="ml-1 h-5 w-5 flex-shrink-0" />
          </button>
        </div>
      )}
    </>
  );
}

function FilterOption({
  searchResultFilter,
  title,
  filterKey,
}: FilterOptionProps) {
  const listStore = useListStore();
  const selectedFilters = useMemo(
    () => listStore.selectedFilters[filterKey] || [],
    [filterKey, listStore.selectedFilters]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        listStore.filterChange(filterKey, [...selectedFilters, e.target.value]);
      } else {
        listStore.filterChange(
          filterKey,
          selectedFilters.filter(filterId => e.target.value !== filterId)
        );
      }
    },
    [filterKey, listStore, selectedFilters]
  );

  return (
    <div className="flex">
      <input
        value={searchResultFilter.id}
        id={`${title}-${searchResultFilter.id}`}
        name={searchResultFilter.id}
        checked={selectedFilters.some(
          filterId => searchResultFilter.id === filterId
        )}
        onChange={handleChange}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-sky-700 focus:ring-sky-700"
      />
      <label
        htmlFor={`${title}-${searchResultFilter.id}`}
        className="ml-3 text-sm text-gray-900"
      >
        {searchResultFilter.name}
      </label>
    </div>
  );
}

export function FilterSet({
  title,
  searchResultFilters,
  filterKey,
  testId,
}: Props) {
  const t = useTranslations('Filters');
  const [isExpanded, setIsExpanded] = useState(false);
  const {x, y, strategy, context, refs} = useFloating({
    placement: 'right-start',
    open: isExpanded,
    onOpenChange: setIsExpanded,
    middleware: [
      size({
        apply({availableWidth, elements}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
          });
        },
      }),
    ],
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useDismiss(context),
  ]);
  const [query, setQuery] = useState('');
  const filteredSearchResultFilters: SearchResultFilter[] = useMemo(() => {
    return searchResultFilters.filter(searchResultFilter =>
      searchResultFilter.name
        ?.toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
    );
  }, [query, searchResultFilters]);

  return (
    <div
      className="mt-6 mr-4 max-w-[350px]"
      data-testid={testId}
      aria-label={t('accessibilitySelectToFilter')}
    >
      <div
        className="w-0"
        ref={refs.setReference}
        {...getReferenceProps()}
      ></div>
      <div>
        <Header
          {...{
            searchResultFilters,
            title,
            setIsExpanded,
            setQuery,
            query: query,
          }}
        />
        <div className="space-y-3 pt-2">
          {filteredSearchResultFilters.slice(0, 5).map(option => (
            <FilterOption
              key={`${option.id}${option.name}`}
              {...{
                filterKey,
                title,
                searchResultFilter: option,
              }}
            />
          ))}
        </div>
      </div>
      {isExpanded && (
        <div
          className="bg-white z-40 p-3 -m-3 md:drop-shadow-md"
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          {...getFloatingProps()}
        >
          <div>
            <Header
              {...{
                searchResultFilters,
                title,
                setIsExpanded,
                setQuery,
                query: query,
              }}
            />
            <div className="md:flex pt-2">
              {[
                ...Array(
                  Math.ceil(
                    filteredSearchResultFilters.length / maxOptionsInColumn
                  )
                ),
              ].map((_, i) => (
                <div key={i} className="space-y-3 mr-2 md:w-[350px]">
                  {filteredSearchResultFilters
                    .slice(
                      i * maxOptionsInColumn,
                      i * maxOptionsInColumn + maxOptionsInColumn
                    )
                    .map(option => (
                      <FilterOption
                        key={`${option.id}${option.name}`}
                        {...{
                          filterKey,
                          title,
                          searchResultFilter: option,
                        }}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
