'use client';

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {SearchOptions, SearchResult} from '@/lib/dataset-fetcher';
import DatasetCard from './dataset-card';
import FilterSet from './filter-set';

interface SearchDatasets {
  selectedLicenses: string[];
  selectedPublishers: string[];
}

const searchDatasets = async ({
  selectedLicenses,
  selectedPublishers,
}: SearchDatasets): Promise<SearchResult> => {
  const options: SearchOptions = {
    filters: {
      publishers: selectedPublishers,
      licenses: selectedLicenses,
    },
  };
  const response = await fetch('/api/dataset-search', {
    method: 'POST',
    body: JSON.stringify(options),
  });
  return response.json();
};

interface Props {
  initialSearchResult: SearchResult;
  locale: string;
}

export default function DatasetList({initialSearchResult, locale}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);

  const {data, error} = useQuery({
    queryKey: ['Datasets', {selectedLicenses, selectedPublishers}],
    queryFn: async () => searchDatasets({selectedLicenses, selectedPublishers}),
    // only show initial data if no filters are set
    initialData:
      selectedLicenses.length === 0 && selectedPublishers.length === 0
        ? initialSearchResult
        : undefined,
  });

  if (error instanceof Error) {
    return (
      <div
        className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        <p>There was an error fetching the dataset.</p>
      </div>
    );
  }

  if (!data?.datasets) {
    // Place a loader here, this will only show after the user selects a filter
    return <></>;
  }

  return (
    <>
      <aside>
        <div>
          <form className="space-y-10 divide-y divide-gray-200">
            {!!data.filters?.licenses?.length && (
              <FilterSet
                title="Licenses"
                options={data.filters?.licenses}
                selectedFilters={selectedLicenses}
                setSelectedFilters={setSelectedLicenses}
              />
            )}
            {!!data.filters?.licenses?.length && (
              <FilterSet
                title="Owners"
                options={data.filters.publishers}
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
          {data.datasets.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
