import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {Dataset} from '@/lib/dataset-fetcher';

export default function DatasetCard({dataset}: {dataset: Dataset}) {
  const t = useTranslations('DatasetCard');

  return (
    <div
      key={dataset.id}
      className="group relative flex flex-col overflow-hidden drop-shadow-md hover:drop-shadow-lg hover:-translate-y-0.5 transition ease-in-out duration-300 bg-white"
      aria-label={t('Dataset')}
    >
      <div className="flex flex-1 flex-col space-y-2 p-6">
        <h2 className="font-semibold text-gray-900 mt-0">
          <Link
            href={`/dataset/${encodeURIComponent(dataset.id)}`}
            data-testid="dataset-card-name"
            className="text-gray-900"
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {dataset.name}
          </Link>
        </h2>
        <p className="text-base text-gray-900">{dataset.description}</p>
        <div className="mt-2 flex">
          <span className="text-sm -ml-2 mr-4 px-2 py-1 bg-stone-100 rounded">
            {dataset.publisher.name}
          </span>
          <span className="text-sm -ml-2 mr-4 px-2 py-1 bg-stone-100 rounded">
            {dataset.license.name}
          </span>
        </div>
        <div className="mt-2 flex text-sm">
          <span className="mr-3">{t('keywords')}: </span>
          {dataset.keywords?.map(keyword => (
            <span key={keyword} className="mr-3">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
