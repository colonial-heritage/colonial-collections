'use client';

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {SearchResult} from '@/lib/dataset-fetcher';
import DatasetCard from './dataset-card';
import FilterSet from './filter-set';

// TODO Replace these two dummy lists with the correct data.
// Either by an API call if the lists are dynamic.
// Or if the lists are more static, with a JSON import or getStaticProps.

const dummyLicenses = [
  {
    value: '1',
    label: 'License 1',
  },
  {
    value: '2',
    label: 'License 2',
  },
  {
    value: '3',
    label: 'License 3',
  },
  {
    value: '4',
    label: 'License 4',
  },
];

const dummyOwners = [
  {
    value: '1',
    label: 'Owner 1',
  },
  {
    value: '2',
    label: 'Owner 2',
  },
  {
    value: '3',
    label: 'Owner 3',
  },
  {
    value: '4',
    label: 'Owner 4',
  },
];

interface SearchDatasets {
  selectedLicenses: string[];
  selectedOwners: string[];
}

const searchDatasets = async ({
  selectedLicenses,
  selectedOwners,
}: SearchDatasets): Promise<SearchResult> => {
  const response = await fetch('/api/dataset-search', {
    method: 'POST',
    // TODO send the correct filter query
    // The body should have the same interface as SearchOptions
    body: JSON.stringify({selectedLicenses, selectedOwners}),
  });
  return response.json();
};

interface Props {
  initialSearchResult: SearchResult;
  locale: string;
}

export default function DatasetList({initialSearchResult, locale}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);

  // replace this with the correct lists
  const licenses = dummyLicenses;
  const owners = dummyOwners;

  const {data, error} = useQuery({
    queryKey: ['Datasets', {selectedLicenses, selectedOwners}],
    queryFn: async () => searchDatasets({selectedLicenses, selectedOwners}),
    initialData: initialSearchResult,
  });

  return (
    <>
      <aside>
        <div>
          <form className="space-y-10 divide-y divide-gray-200">
            <FilterSet
              title="License"
              options={licenses}
              selectedFilters={selectedLicenses}
              setSelectedFilters={setSelectedLicenses}
            />
            <FilterSet
              title="Owners"
              options={owners}
              selectedFilters={selectedOwners}
              setSelectedFilters={setSelectedOwners}
            />
          </form>
        </div>
      </aside>

      <section
        aria-labelledby="dataset-heading"
        className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
      >
        {error instanceof Error ? (
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p>There was an error fetching the dataset.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {data.datasets.map(dataset => (
              <DatasetCard key={dataset.id} dataset={dataset} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
