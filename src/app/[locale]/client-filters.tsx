'use client';

import {
  useState,
  ReactNode,
  useEffect,
  useTransition,
  Fragment,
  useMemo,
} from 'react';
import {SearchOptions, SearchResult} from '@/lib/dataset-fetcher';
import FilterSet from './filter-set';
import Paginator from './paginator';
import {PageTitle, PageHeader} from '@/components/page';
import {useTranslations} from 'next-intl';
import SelectedFilters from './selected-filters';
import {useRouter} from 'next/navigation';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import {getUrlWithSearchParams, SortBy} from '@/lib/search-params';

export interface Props {
  filters: SearchResult['filters'];
  limit: SearchResult['limit'];
  totalCount: SearchResult['totalCount'];
  children: ReactNode;
  sortBy: SortBy;
  searchOptions: SearchOptions;
}

export default function ClientFilters({
  children,
  filters,
  limit,
  totalCount,
  sortBy: initialSortBy,
  searchOptions,
}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>(
    searchOptions?.filters?.licenses ?? []
  );
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>(
    searchOptions?.filters?.publishers ?? []
  );
  const [selectedSpatialCoverages, setSelectedSpatialCoverages] = useState<
    string[]
  >(searchOptions?.filters?.spatialCoverages ?? []);
  const [query, setQuery] = useState(searchOptions?.query ?? '');
  const [offset, setOffset] = useState(searchOptions?.offset ?? 0);
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [showFiltersSidebarOnSmallScreen, setShowFiltersSidebarOnSmallScreen] =
    useState(false);
  const t = useTranslations('Home');
  const router = useRouter();
  // Use the first param `isPending` of `useTransition` for a loading state.
  const [, startTransition] = useTransition();

  useEffect(() => {
    const urlWithSearchParams = getUrlWithSearchParams({
      query,
      licenses: selectedLicenses,
      publishers: selectedPublishers,
      spatialCoverages: selectedSpatialCoverages,
      offset,
      sortBy,
    });
    startTransition(() => {
      router.replace(urlWithSearchParams);
    });
  }, [
    query,
    offset,
    sortBy,
    selectedLicenses,
    selectedPublishers,
    router,
    selectedSpatialCoverages,
  ]);

  function handleSortByChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(e.target.value as SortBy);
  }

  const renderFilters = useMemo(
    () => (
      <>
        <div className="pr-4 max-w-[350px]" id="facets">
          <label htmlFor="search" className="block font-semibold text-gray-900">
            {t('search')}
          </label>
          <input
            data-testid="searchQuery"
            value={query}
            onChange={e => setQuery(e.target.value)}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 px-4 shadow-sm focus:border-sky-700 focus:ring-sky-700 sm:text-sm"
            aria-label={t('accessibilityTypeToFilter')}
          />
        </div>
        {!!filters.licenses?.length && (
          <FilterSet
            title={t('licensesFilter')}
            searchResultFilters={filters.licenses}
            selectedFilters={selectedLicenses}
            setSelectedFilters={setSelectedLicenses}
            testId="licensesFilter"
          />
        )}
        {!!filters.licenses?.length && (
          <FilterSet
            title={t('publishersFilter')}
            searchResultFilters={filters.publishers}
            selectedFilters={selectedPublishers}
            setSelectedFilters={setSelectedPublishers}
            testId="publishersFilter"
          />
        )}
        {!!filters.spatialCoverages?.length && (
          <FilterSet
            title={t('spatialCoveragesFilter')}
            searchResultFilters={filters.spatialCoverages}
            selectedFilters={selectedSpatialCoverages}
            setSelectedFilters={setSelectedSpatialCoverages}
            testId="spatialCoveragesFilter"
          />
        )}
      </>
    ),
    [
      filters.licenses,
      filters.publishers,
      filters.spatialCoverages,
      query,
      selectedLicenses,
      selectedPublishers,
      selectedSpatialCoverages,
      t,
    ]
  );

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
      <aside className="self-stretch hidden md:flex md:h-full w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2">
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
              <PageTitle>{t('title', {totalDatasets: totalCount})}</PageTitle>
            </div>
            <div>
              <select
                name="location"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                value={sortBy}
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
            filters={[
              {
                searchResultFilters: filters.licenses ?? [],
                selectedFilters: selectedLicenses,
                setSelectedFilters: setSelectedLicenses,
              },
              {
                searchResultFilters: filters.publishers ?? [],
                selectedFilters: selectedPublishers,
                setSelectedFilters: setSelectedPublishers,
              },
              {
                searchResultFilters: filters.spatialCoverages ?? [],
                selectedFilters: selectedSpatialCoverages,
                setSelectedFilters: setSelectedSpatialCoverages,
              },
            ]}
            query={{
              value: query,
              setQuery,
            }}
          />
        </PageHeader>

        {children}
        {totalCount && totalCount > 0 ? (
          <Paginator
            totalCount={totalCount}
            offset={offset}
            setOffset={setOffset}
            limit={limit}
          />
        ) : null}
      </section>
    </>
  );
}
