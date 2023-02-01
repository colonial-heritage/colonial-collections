'use client';

import {useQuery} from '@tanstack/react-query';
import {SearchResult} from '@/lib/dataset-fetcher';
import DatasetCard from './dataset-card';

interface Props {
  initialSearchResult: SearchResult;
  locale: string;
}

export default function DatasetList({initialSearchResult, locale}: Props) {
  const queryResponse: {data: SearchResult} = useQuery({
    queryKey: ['Datasets'],
    queryFn: async () => {
      const response = await fetch('/api/datasets');
      return response.json();
    },
    initialData: initialSearchResult,
  });

  return (
    <>
      <aside>{/* place the filters here */}</aside>

      <section
        aria-labelledby="dataset-heading"
        className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
      >
        <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {queryResponse.data.datasets.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
