import {Dataset} from '@/lib/dataset-fetcher';
import Link from 'next/link';

interface Props {
  dataset: Dataset;
  locale: string;
}

export default function DatasetCard({dataset, locale}: Props) {
  return (
    <div
      key={dataset.id}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`${locale}/dataset/${encodeURIComponent(dataset.id)}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {dataset.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">{dataset.description}</p>
      </div>
    </div>
  );
}
