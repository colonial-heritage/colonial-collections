'use client';

import {useQuery} from '@tanstack/react-query';
import {SearchResult} from '@/lib/dataset-fetcher';
import DatasetCard from '@/components/dataset-card';
import {Dataset} from '@/lib/dataset-fetcher';

interface ClientPageProps {
  initialDatasets: SearchResult;
  locale: string;
}

export default function ClientPage({initialDatasets, locale}: ClientPageProps) {
  const {data: {datasets} = {}}: {data: {datasets?: Array<Dataset>}} = useQuery(
    {
      queryKey: ['Datasets'],
      queryFn: () =>
        fetch('/api/fetch-datasets').then(response => response.json()),
      initialData: initialDatasets,
    }
  );

  return (
    <>
      <aside>{/* place the filters here */}</aside>

      <section
        aria-labelledby="dataSet-heading"
        className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
      >
        <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {datasets?.map(dataset => (
            <DatasetCard key={dataset.id} dataset={dataset} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
