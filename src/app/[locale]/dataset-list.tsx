'use client';

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {SearchResult} from '@/lib/dataset-fetcher';
import DatasetCard from './dataset-card';
import FilterSet from './filter-set';
import {clientSearchDatasets} from './client-search-dataset';

interface Props {
  initialSearchResult: SearchResult;
  locale: string;
}

export default function DatasetList({initialSearchResult, locale}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const {data, error} = useQuery({
    queryKey: [
      'Datasets',
      {selectedLicenses, selectedPublishers, search: query},
    ],
    queryFn: async () =>
      clientSearchDatasets({
        query,
        licenses: selectedLicenses,
        publishers: selectedPublishers,
      }),
    // Keep the previous data to prevent flickering after filtering.
    keepPreviousData: true,
    // Only show initial data if no filters are set.
    initialData:
      selectedLicenses.length === 0 && selectedPublishers.length === 0 && !query
        ? initialSearchResult
        : undefined,
  });

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
      <aside>
        <div>
          <form className="space-y-10 divide-y divide-gray-200">
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
          </form>
        </div>
      </aside>

      <section
        aria-labelledby="dataset-heading"
        className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
      >
        <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {data?.datasets.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
