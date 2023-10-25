'use client';

import {Modal, ModalButton, ModalHeader} from '../modal';
import {FacetCheckBox, FacetTitle, FacetWrapper} from './base-facet';
import {SearchResultFilter} from './SearchResultFilter';
import {useEffect} from 'react';
import {
  InformationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import {SelectedFiltersForKey} from './selected-filters';
import {useTranslations} from 'next-intl';
import {
  useSearchableFacet,
  FacetSortBy,
  FacetProvider,
  useListStore,
} from '@colonial-collections/list-store';

interface ExpandedFacetProps {
  filterKey: string;
}

function ExpandedFacet({filterKey}: ExpandedFacetProps) {
  const {
    searchValue,
    setSearchValue,
    toggleLetterCategory,
    letterCategory,
    sortBy,
    setSortBy,
    filteredFilters,
    letterCategories,
    filters,
  } = useSearchableFacet();

  const t = useTranslations('Filters');
  const listStore = useListStore();

  function selectAllClick() {
    const selectedFilters = [
      ...((listStore.selectedFilters[filterKey] as (string | number)[]) || []),
      ...filteredFilters.map(filter => filter.id),
    ];

    const uniqueFilters = Array.from(new Set(selectedFilters));

    listStore.filterChange(filterKey, uniqueFilters);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-10 max-h-[95%]">
      <div className="w-full md:w-1/2 lg:w-3/4 flex flex-col">
        <div className="my-4">
          <div className="flex flex-col lg:flex-row justify-start gap-4">
            <input
              placeholder={t('filterPlaceholder', {
                filterName: t(`${filterKey}Filter`),
              })}
              type="text"
              className="block border rounded-md grow border-gray-300 px-2 py-1 shadow-sm focus:border-sky-700 focus:ring-sky-700 sm:text-sm max-w-lg"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={() => selectAllClick()}
                className="px-4 py-2 text-sm rounded-full bg-neutral-100 hover:bg-neutral-200 transition text-neutral-800 flex items-center gap-1"
              >
                {t('selectAll', {searchValue})}
              </button>
            )}
          </div>
          <div className="py-4 my-4 border-y flex flex-col lg:flex-row justify-between">
            <div className="flex flex-row gap-2">
              {letterCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleLetterCategory(category)}
                  className={
                    letterCategory === category
                      ? 'px-1 bg-black text-white rounded'
                      : ''
                  }
                >
                  {category}
                </button>
              ))}
            </div>
            <div>
              <select
                name="facetItemOrder"
                className="mt-1 block  rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                aria-label="Select to change the ordering of the result"
                value={sortBy}
                onChange={event => setSortBy(event.target.value as FacetSortBy)}
              >
                <option value="alphabetical">{t('orderAlphabetically')}</option>
                <option value="count">{t('orderByCount')}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="md:columns-1 lg:columns-2 xl:columns-3 gap-4 overflow-y-auto">
          {filteredFilters.map(filter => (
            <FacetCheckBox
              key={`ExpandedFacet-${filter.id}`}
              filterKey={filterKey}
              name={filter.name}
              id={filter.id}
              count={filter.totalCount}
            />
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-2">
        <h3 className="flex items-center gap-2">
          <InformationCircleIcon className="w-5 h-5 fill-bg-sky-500" />
          {t('aboutFacetsHeader')}
        </h3>

        <div className="pb-4">{t('aboutFacetsText')}</div>
        <h3>{t('selectedFilters')}</h3>

        <div className="flex gap-2 flex-wrap  overflow-y-auto">
          <SelectedFiltersForKey
            searchParamType="array"
            filters={filters}
            filterKey={filterKey}
          />
        </div>
      </div>
    </div>
  );
}

export function FirstFilters({
  filterKey,
  filters,
}: {
  filterKey: string;
  filters: SearchResultFilter[];
}) {
  const {filteredFilters, setFilters} = useSearchableFacet();
  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);
  return (
    <>
      {filteredFilters.slice(0, 5).map(filter => (
        <FacetCheckBox
          key={`SearchableFacet-${filter.id}`}
          filterKey={filterKey}
          name={filter.name}
          id={filter.id}
          count={filter.totalCount}
        />
      ))}
    </>
  );
}

interface Props {
  title: string;
  filters: SearchResultFilter[];
  filterKey: string;
  testId?: string;
}

export function SearchableFacet({title, filters, filterKey, testId}: Props) {
  const t = useTranslations('Filters');

  return (
    <FacetWrapper testId={testId}>
      <div className="flex items-center w-full my-1">
        <FacetTitle title={title} />
        <ModalButton
          id={filterKey}
          className="ml-3 inline-flex items-center text-sky-700"
        >
          <span>{t('expandFilter')}</span>
          <ChevronRightIcon className="w-4 h-4 fill-bg-sky-700" />
        </ModalButton>
      </div>
      <FacetProvider filters={filters}>
        <>
          <FirstFilters filterKey={filterKey} filters={filters} />
          <Modal id={filterKey}>
            <ModalHeader title={title} />
            <ExpandedFacet filterKey={filterKey} />
          </Modal>
        </>
      </FacetProvider>
    </FacetWrapper>
  );
}
