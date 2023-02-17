'use client';

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {SearchResult} from '@/lib/dataset-fetcher';
import DatasetCard from './dataset-card';
import FilterSet from './filter-set';
import {clientSearchDatasets} from './client-search-dataset';
import Paginator from './paginator';
import {
  PageSidebar,
  PageContent,
  PageTitle,
  PageHeader,
} from '@/components/page';
import {useTranslations} from 'next-intl';
import SelectedFilters from './selected-filters';

export enum Sort {
  RelevanceDesc = 'relevanceDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export interface Props {
  initialSearchResult: SearchResult;
  locale: string;
}

export const defaultSort = Sort.RelevanceDesc;

export default function DatasetList({initialSearchResult, locale}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<Sort>(defaultSort);
  const t = useTranslations('Home');

  const {data, error} = useQuery({
    queryKey: [
      'Datasets',
      {selectedLicenses, selectedPublishers, query, offset, sort},
    ],
    queryFn: async () =>
      clientSearchDatasets({
        query,
        licenses: selectedLicenses,
        publishers: selectedPublishers,
        offset,
        sort,
      }),
    // Keep the previous data to prevent flickering after filtering.
    keepPreviousData: true,
    // Only show initial data if no filters are set.
    initialData:
      selectedLicenses.length === 0 &&
      selectedPublishers.length === 0 &&
      !query &&
      sort === Sort.RelevanceDesc
        ? initialSearchResult
        : undefined,
  });

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(e.target.value as Sort);
  }

  if (error instanceof Error) {
    return (
      <div
        className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 lg:col-span-3 xl:col-span-4"
        role="alert"
        data-test="fetch-error"
      >
        <p>{t('fetchError')}</p>
      </div>
    );
  }

  return (
    <>
      <PageSidebar>
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-900"
          >
            {t('search')}
          </label>
          <input
            data-test="searchQuery"
            value={query}
            onChange={e => setQuery(e.target.value)}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-full border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {!!data?.filters?.licenses?.length && (
          <FilterSet
            title={t('licensesFilter')}
            searchResultFilters={data.filters.licenses}
            selectedFilters={selectedLicenses}
            setSelectedFilters={setSelectedLicenses}
            data-test="licensesFilter"
          />
        )}
        {!!data?.filters?.licenses?.length && (
          <FilterSet
            title={t('publishersFilter')}
            searchResultFilters={data.filters.publishers}
            selectedFilters={selectedPublishers}
            setSelectedFilters={setSelectedPublishers}
            data-test="publishersFilter"
          />
        )}
      </PageSidebar>

      <PageContent>
        <PageHeader>
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <PageTitle>
                {t('title', {totalDatasets: data?.totalCount})}
              </PageTitle>
            </div>
            <div>
              <select
                name="location"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={sort}
                onChange={handleSortChange}
              >
                <option value={Sort.RelevanceDesc}>
                  {t('sortRelevanceDesc')}
                </option>
                <option value={Sort.NameAsc}>{t('sortNameAsc')}</option>
                <option value={Sort.NameDesc}>{t('sortNameDesc')}</option>
              </select>
            </div>
          </div>
          <SelectedFilters
            filters={[
              {
                searchResultFilters: data?.filters.licenses ?? [],
                selectedFilters: selectedLicenses,
                setSelectedFilters: setSelectedLicenses,
              },
              {
                searchResultFilters: data?.filters.publishers ?? [],
                selectedFilters: selectedPublishers,
                setSelectedFilters: setSelectedPublishers,
              },
            ]}
            query={{
              value: query,
              setQuery,
            }}
          />
        </PageHeader>
        {data?.totalCount && data?.totalCount > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
              {data?.datasets.map(dataset => (
                <DatasetCard
                  key={dataset.id}
                  dataset={dataset}
                  locale={locale}
                />
              ))}
            </div>
            <Paginator
              totalCount={data?.totalCount}
              offset={offset}
              setOffset={setOffset}
              limit={data?.limit}
            />
          </>
        ) : (
          <div data-test="no-results">{t('noResults')}</div>
        )}
      </PageContent>
    </>
  );
}
