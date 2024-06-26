import {getTranslations, getFormatter, getLocale} from 'next-intl/server';
import {
  PageHeader,
  PageTitle,
  SlideOverContent,
  SlideOverHeader,
  SlideOver,
  SlideOverOpenButton,
  SlideOverDialog,
  LocalizedMarkdown,
} from '@colonial-collections/ui';
import {
  InformationCircleIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import datasets from '@/lib/datasets-instance';
import {Fragment} from 'react';
import BooleanMeasurement from '@/components/boolean-measurement';
import metricIds from '@/lib/transparency-metrics';
import BackButton from './back-button';
import {LocaleEnum} from '@/definitions';

interface Props {
  params: {id: string};
}

// Revalidate the page
export const revalidate = 0;

export default async function Details({params}: Props) {
  const id = decodeURIComponent(params.id);
  const locale = (await getLocale()) as LocaleEnum;
  const dataset = await datasets.getById({id, locale});
  const t = await getTranslations('Details');
  const tMetrics = await getTranslations('TransparencyMetrics');
  const formatter = await getFormatter();

  if (!dataset) {
    return <div data-testid="no-dataset">{t('noDataset')}</div>;
  }

  const navigation = [
    {name: t('navigation.about'), href: '#about'},
    {name: t('navigation.measurements'), href: '#measurements'},
    {name: t('navigation.metadata'), href: '#metadata'},
  ];

  const datasetProperties = [
    {
      name: t('metadata.moreInfo'),
      value: dataset.mainEntityOfPages?.length && (
        <div className="flex flex-col">
          {dataset.mainEntityOfPages.map(url => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          ))}
        </div>
      ),
    },
    {
      name: t('metadata.license'),
      value: dataset.license && (
        <a href={dataset.license.id} target="_blank" rel="noreferrer">
          {dataset.license.name}
        </a>
      ),
    },
    {
      name: t('metadata.publisher'),
      value: dataset.publisher?.name,
    },
    {
      name: t('metadata.datePublished'),
      value: dataset.datePublished && formatter.dateTime(dataset.datePublished),
    },
    {
      name: t('metadata.dateCreated'),
      value: dataset.dateCreated && formatter.dateTime(dataset.dateCreated),
    },
    {
      name: t('metadata.dateModified'),
      value: dataset.dateModified && formatter.dateTime(dataset.dateModified),
    },
    {
      name: t('metadata.keywords'),
      value: dataset.keywords?.join(' | '),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-16 mt-10">
      <aside className="w-full md:w-1/5 flex flex-row md:flex-col md:border-r border-neutral-200 pr-4">
        <div className="flex flex-col gap-6">
          <BackButton>
            <ChevronLeftIcon className="h-5 w-5" />
            {t('back')}
          </BackButton>
          <nav className="flex-1 space-y-1 pb-4 text-sm">
            {navigation.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="flex px-2 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <section className="w-full sm:w-4/5 gap-6 flex flex-col">
        <div className="divide-y-2 divide-white flex flex-col">
          <div className="pb-10">
            <PageHeader>
              <PageTitle id="about">{dataset.name}</PageTitle>
            </PageHeader>
            <div>{dataset.description}</div>
          </div>
          <div className="py-10">
            <h2
              className="leading-6 mb-6 font-semibold text-lg"
              id="measurements"
            >
              {t('measurements.title')}
            </h2>
            <div className="grid grid-cols-4 gap-1 bg-white">
              {metricIds.map(metricId => {
                // Language keys can not contain a '.'.
                const translationId = metricId.replace(/\./g, '%2E');
                const measurement = dataset.measurements?.find(
                  measurement => measurement.metric.id === metricId
                );
                return (
                  <div
                    key={metricId}
                    className="flex flex-1 flex-col gap-3 text-center p-4 bg-consortium-sand-50"
                  >
                    <div className="flex flex-col items-center h-full w-full font-semibold text-base">
                      {tMetrics(`${translationId}.longTitle`)}
                    </div>
                    {measurement ? (
                      <>
                        <div className="flex flex-col items-center h-full w-full shrink">
                          <BooleanMeasurement value={measurement.value} />
                        </div>
                        <div className="flex flex-col items-center justify-end h-full w-full">
                          {tMetrics(
                            `${translationId}.description${
                              measurement.value ? 'True' : 'False'
                            }`
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">{tMetrics('unknown')}</div>
                    )}
                  </div>
                );
              })}
              <div className="flex-1 gap-3 font-semibold text-base p-4 bg-neutral-50">
                <SlideOver>
                  <SlideOverOpenButton className="text-consortium-blue-500 underline hover:no-underline inline-block text-left">
                    {t('measurements.moreInfo')}
                    <InformationCircleIcon className="w-6 h-6 align-middle inline-block ml-1" />
                  </SlideOverOpenButton>
                  <SlideOverDialog>
                    <SlideOverHeader />
                    <SlideOverContent>
                      <LocalizedMarkdown
                        name="transparency-measurements"
                        contentPath="@/messages"
                      />
                    </SlideOverContent>
                  </SlideOverDialog>
                </SlideOver>
              </div>
              <div className="flex flex-1 gap-3 bg-consortium-sand-50"></div>
            </div>
          </div>
          <div className="py-10">
            <h2 className="leading-6 mb-6 font-semibold text-lg" id="metadata">
              {t('metadata.title')}
            </h2>
            {datasetProperties.map(property => (
              <Fragment key={property.name}>
                <h3 className="mb-0 font-semibold">{property.name}</h3>
                <div className="mt-0 text-gray-900 sm:col-span-3 sm:mt-0 mb-6">
                  {property.value}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
