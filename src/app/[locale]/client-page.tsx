'use client';

import {useQuery} from '@tanstack/react-query';
import {SearchResult} from '@/lib/dataset-fetcher';
import DataSetCard from '@/components/data-set-card';
import {Dataset} from '@/lib/dataset-fetcher';

export default function ClientPage({
  initialDataSets,
}: {
  initialDataSets: SearchResult;
}) {
  const {data: {datasets} = {}}: {data: {datasets?: Array<Dataset>}} = useQuery(
    {
      queryKey: ['DataSets'],
      queryFn: () => fetch('/api/fetch').then(response => response.json()),
      initialData: initialDataSets,
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
            <DataSetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </section>
    </>
  );
}
