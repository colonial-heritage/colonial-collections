import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {Dataset} from '@/lib/dataset-fetcher';
import Badge from '@/components/badge';

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
        <div className="mt-2 flex flex-wrap">
          <Badge variant="gray"> {dataset.publisher.name} </Badge>
          <Badge variant="gray"> {dataset.license.name} </Badge>
          {dataset.spatialCoverages?.map(spatialCoverage => (
            <Badge variant="gray" key={spatialCoverage.id}>
              {spatialCoverage.name}
            </Badge>
          ))}
          {dataset.genres?.map(genre => (
            <Badge variant="gray" key={genre.id}>
              {genre.name}
            </Badge>
          ))}
        </div>
        {dataset.keywords?.length && (
          <div className="mt-2 flex text-sm flex-wrap">
            <span className="mr-3">{t('keywords')}: </span>
            {dataset.keywords?.map(keyword => (
              <span key={keyword} className="mr-3">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
