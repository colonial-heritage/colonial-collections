import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {Dataset} from '@/lib/datasets';
import {Badge} from 'ui';
import {
  GlobeEuropeAfricaIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/solid';
import {DocumentCheckIcon, TagIcon} from '@heroicons/react/24/outline';

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
        <div className="inline-flex items-stretch border border-neutral-100 flex-wrap">
          {dataset.measurements?.map(measurement => (
            <div
              key={measurement.id}
              className="flex flex-1 flex-col gap-3 text-center font-semibold leading-2 text-base p-3 border border-gray-100"
            >
              <div className="flex flex-col items-center justify-end h-full w-full">
                {measurement.metric.name}
              </div>
              <div className="flex flex-col items-center justify-end h-full w-full shrink">
                {measurement.value ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="stroke-sky-500 w-5 h-5 stroke-[5px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="stroke-gray-300 w-5 h-5 stroke-[5px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap">
          <Badge variant="gray">
            <Badge.Icon Icon={BuildingLibraryIcon} variant="solid" />
            {dataset.publisher.name}
          </Badge>
          <Badge variant="gray">
            <Badge.Icon Icon={DocumentCheckIcon} />
            {dataset.license.name}
          </Badge>
          {dataset.spatialCoverages?.map(spatialCoverage => (
            <Badge variant="gray" key={spatialCoverage.id}>
              <Badge.Icon Icon={GlobeEuropeAfricaIcon} variant="solid" />
              {spatialCoverage.name}
            </Badge>
          ))}
          {dataset.genres?.map(genre => (
            <Badge variant="gray" key={genre.id}>
              <Badge.Icon Icon={TagIcon} />
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
