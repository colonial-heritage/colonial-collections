import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {Dataset} from '@/lib/dataset-fetcher';

interface Props {
  dataset: Dataset;
  locale: string;
}

export default function DatasetCard({dataset, locale}: Props) {
  const t = useTranslations('DatasetCard');

  return (
    <div
      key={dataset.id}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
      data-test="dataset-card"
    >
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`${locale}/dataset/${encodeURIComponent(dataset.id)}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {dataset.name}
          </Link>
        </h3>
        <div className="mt-2 flex">
          <p className="text-xs text-gray-500 mr-10">
            {t('owner')}: {dataset.publisher.name}
          </p>
          <p className="text-xs text-gray-500">
            {t('license')}: {dataset.license.name}
          </p>
        </div>
        <p className="text-sm text-gray-500">{dataset.description}</p>
        <div className="mt-2 flex">
          {dataset.keywords?.map(keyword => (
            <p key={keyword} className="text-xs text-gray-500 mr-10">
              {keyword}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
