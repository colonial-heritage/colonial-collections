import {Link} from '@/navigation';
import {useTranslations} from 'next-intl';
import {Dataset} from '@colonial-collections/api';
import {Badge, BadgeIcon} from '@colonial-collections/ui';
import {BuildingLibraryIcon} from '@heroicons/react/24/solid';
import {DocumentCheckIcon} from '@heroicons/react/24/outline';
import BooleanMeasurement from '@/components/boolean-measurement';
import metricIds from '@/lib/transparency-metrics';

export default function DatasetCard({dataset}: {dataset: Dataset}) {
  const t = useTranslations('DatasetCard');
  const tMetrics = useTranslations('TransparencyMetrics');

  return (
    <div
      key={dataset.id}
      className="group relative flex flex-col overflow-hidden transition ease-in-out duration-300 bg-neutral-100 border border-neutral-100 hover:bg-white hover:border-consortium-blue-800"
      aria-label={t('Dataset')}
    >
      <div className="flex flex-1 flex-col space-y-3 p-6">
        <h2 className="font-semibold text-gray-900 mt-0">
          <Link
            href={`/datasets/${encodeURIComponent(dataset.id)}`}
            data-testid="dataset-card-name"
            className="text-gray-900"
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {dataset.name}
          </Link>
        </h2>
        <p className="text-base text-gray-900">{dataset.description}</p>
        <div className="inline-flex items-stretch border border-neutral-100 flex-wrap">
          {metricIds.map(metricId => {
            const measurement = dataset.measurements?.find(
              measurement => measurement.metric.id === metricId
            );

            return (
              <div
                key={metricId}
                className="flex flex-1 flex-col gap-3 text-center font-semibold leading-2 text-base p-3 border-y border-l border-neutral-300 last:border-r"
              >
                <div className="flex flex-col items-center justify-end h-full w-full">
                  {/* Language keys can not contain a '.'. */}
                  {tMetrics(`${metricId.replace(/\./g, '%2E')}.shortTitle`)}
                </div>
                {measurement ? (
                  <div className="flex flex-col items-center justify-end h-full w-full shrink">
                    <BooleanMeasurement value={measurement.value} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-end h-full w-full shrink text-gray-400">
                    {tMetrics('unknown')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          <Badge variant="gray">
            <BadgeIcon Icon={BuildingLibraryIcon} variant="solid" />
            {dataset.publisher?.name}
          </Badge>
          <Badge variant="gray">
            <BadgeIcon Icon={DocumentCheckIcon} />
            {dataset.license?.name}
          </Badge>
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
