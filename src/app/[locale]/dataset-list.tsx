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

export enum SortBy {
  Name = 'name',
  Relevance = 'relevance',
}

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

interface Props {
  initialSearchResult: SearchResult;
  locale: string;
}

export default function DatasetList({initialSearchResult, locale}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<string>(SortBy.Relevance);
  const [sortOrder, setSortOrder] = useState<string>(SortOrder.Ascending);

  const {data, error} = useQuery({
    queryKey: [
      'Datasets',
      {selectedLicenses, selectedPublishers, query, offset, sortBy, sortOrder},
    ],
    queryFn: async () =>
      clientSearchDatasets({
        query,
        licenses: selectedLicenses,
        publishers: selectedPublishers,
        offset,
        sortBy,
        sortOrder,
      }),
    // Keep the previous data to prevent flickering after filtering.
    keepPreviousData: true,
    // Only show initial data if no filters are set.
    initialData:
      selectedLicenses.length === 0 &&
      selectedPublishers.length === 0 &&
      !query &&
      sortBy === SortBy.Relevance &&
      sortOrder === SortOrder.Ascending
        ? initialSearchResult
        : undefined,
  });

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [newSortBy, newSortOrder] = e.target.value.split('_');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }

  if (error instanceof Error) {
    return (
      <div
        className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        <p>{error.message}</p>
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
            Search
          </label>
          <input
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
            title="Licenses"
            searchResultFilters={data.filters?.licenses}
            selectedFilters={selectedLicenses}
            setSelectedFilters={setSelectedLicenses}
          />
        )}
        {!!data?.filters?.licenses?.length && (
          <FilterSet
            title="Owners"
            searchResultFilters={data.filters.publishers}
            selectedFilters={selectedPublishers}
            setSelectedFilters={setSelectedPublishers}
          />
        )}
      </PageSidebar>

      <PageContent>
        <PageHeader>
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <PageTitle>Dataset browser</PageTitle>
            </div>
            <div>
              <select
                name="location"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={`${sortBy}_${sortOrder}`}
                onChange={handleSortChange}
              >
                <option value={`${SortBy.Relevance}_${SortOrder.Ascending}`}>
                  Relevance
                </option>
                <option value={`${SortBy.Name}_${SortOrder.Ascending}`}>
                  Name - Ascending
                </option>
                <option value={`${SortBy.Name}_${SortOrder.Descending}`}>
                  Name - Descending
                </option>
              </select>
            </div>
          </div>
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
          <div>There are no results</div>
        )}
      </PageContent>
    </>
  );
}
