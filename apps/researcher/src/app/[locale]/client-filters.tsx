'use client';

import {useState, ReactNode, Fragment, useMemo} from 'react';
import {SearchResult} from '@/lib/heritage-fetcher';
import FilterSet from './filter-set';
import Paginator from './paginator';
import {PageTitle, PageHeader} from 'ui';
import {useTranslations} from 'next-intl';
import SelectedFilters from './selected-filters';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import {
  useListStore,
  SortBy,
  useSearchParamsUpdate,
} from '@colonial-collections/list-store';

export interface Props {
  children: ReactNode;
  filters: SearchResult['filters'];
  filterKeysOrder: ReadonlyArray<keyof SearchResult['filters']>;
}

export default function ClientFilters({
  children,
  filters,
  filterKeysOrder,
}: Props) {
  const [showFiltersSidebarOnSmallScreen, setShowFiltersSidebarOnSmallScreen] =
    useState(false);
  const t = useTranslations('Home');

  const listStore = useListStore();

  useSearchParamsUpdate();

  function handleSortByChange(e: React.ChangeEvent<HTMLSelectElement>) {
    listStore.setSortBy(e.target.value as SortBy);
  }

  const renderFilters = useMemo(() => {
    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      listStore.setQuery(e.target.value);
    };

    return (
      <>
        <div className="pr-4 max-w-[350px]" id="facets">
          <label htmlFor="search" className="block font-semibold text-gray-900">
            {t('search')}
          </label>
          <input
            data-testid="searchQuery"
            value={listStore.query}
            onChange={handleQueryChange}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 px-4 shadow-sm focus:border-sky-700 focus:ring-sky-700 sm:text-sm"
            aria-label={t('accessibilityTypeToFilter')}
          />
        </div>
        {filterKeysOrder.map(
          filterKey =>
            !!filters[filterKey]?.length && (
              <FilterSet
                key={filterKey}
                title={t(`${filterKey}Filter`)}
                searchResultFilters={filters[filterKey]}
                selectedFilters={listStore.selectedFilters[filterKey] || []}
                setSelectedFilters={selectedFilters =>
                  listStore.setSelectedFilters(filterKey, selectedFilters)
                }
                testId={`${filterKey}Filter`}
              />
            )
        )}
      </>
    );
  }, [filterKeysOrder, filters, listStore, t]);

  return (
    <>
      {/* Small screen filter dialog */}
      <Transition.Root show={showFiltersSidebarOnSmallScreen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setShowFiltersSidebarOnSmallScreen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white px-4 py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('filters')}
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowFiltersSidebarOnSmallScreen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {renderFilters}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <aside className="hidden md:flex w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2">
        {renderFilters}
      </aside>

      <section className="w-full md:w-2/3 gap-6 flex flex-col">
        <button
          type="button"
          className="inline-flex items-center md:hidden"
          onClick={() => setShowFiltersSidebarOnSmallScreen(true)}
        >
          <span className="text-base font-medium text-gray-900">
            {t('filters')}
          </span>
          <AdjustmentsHorizontalIcon
            className="ml-1 h-5 w-5 flex-shrink-0 text-gray-900"
            aria-hidden="true"
          />
        </button>
        <PageHeader>
          <div
            className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap"
            id="search-results"
          >
            <div className="ml-4 mt-2">
              <PageTitle>
                {t('title', {totalDatasets: listStore.totalCount})}
              </PageTitle>
            </div>
            <div>
              <select
                name="location"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                value={listStore.sortBy}
                onChange={handleSortByChange}
                aria-label={t('accessibilitySelectToChangeOrder')}
              >
                <option value={SortBy.RelevanceDesc}>
                  {t('sortRelevanceDesc')}
                </option>
                <option value={SortBy.NameAsc}>{t('sortNameAsc')}</option>
                <option value={SortBy.NameDesc}>{t('sortNameDesc')}</option>
              </select>
            </div>
          </div>
          <SelectedFilters
            filters={filterKeysOrder.map(filterKey => ({
              searchResultFilters: filters[filterKey] ?? [],
              selectedFilters: listStore.selectedFilters[filterKey] ?? [],
              setSelectedFilters: selectedFilters =>
                listStore.setSelectedFilters(filterKey, selectedFilters),
            }))}
            query={{
              value: listStore.query,
              setQuery: listStore.setQuery,
            }}
          />
        </PageHeader>

        {children}
        {listStore.totalCount && listStore.totalCount > 0 ? (
          <Paginator
            totalCount={listStore.totalCount}
            offset={listStore.offset}
            setPage={listStore.setPage}
            limit={listStore.limit}
          />
        ) : null}
      </section>
    </>
  );
}
