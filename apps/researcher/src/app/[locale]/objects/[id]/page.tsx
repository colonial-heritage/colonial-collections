import {getTranslations, getLocale} from 'next-intl/server';
import heritageObjects from '@/lib/heritage-objects-instance';
import Gallery from './gallery';
import ToFilteredListButton from '@/components/to-filtered-list-button';
import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import {ObjectIcon} from '@/components/icons';
import {Metadata} from './metadata';
import {decodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import organizations from '@/lib/organizations-instance';
import {Notifications} from '@colonial-collections/ui';
import useObject from './use-object';
import ObjectListsMenu from './object-lists-menu';
import {heritageObjectEnrichmentFetcher} from '@/lib/enricher-instances';
import {HeritageObjectEnrichmentType} from '@colonial-collections/enricher';
import ISO6391, {LanguageCode} from 'iso-639-1';
import Provenance from './(provenance)/overview';
import {getDateFormatter} from '@/lib/date-formatter/actions';
import {LocaleEnum} from '@/definitions';
import {env} from 'node:process';
import Map from './map';
import {ReadMoreText} from '@/components/read-more-text';
import LocalContextsNotices from './local-contexts-notices/overview';

export const dynamic = 'force-dynamic';

interface Props {
  params: {id: string};
}

export default async function Details({params}: Props) {
  const id = decodeRouteSegment(params.id);
  const locale = (await getLocale()) as LocaleEnum;
  const object = await heritageObjects.getById({id, locale});
  const t = await getTranslations('ObjectDetails');
  const {formatDateRange} = await getDateFormatter();

  if (!object) {
    return <div data-testid="no-entity">{t('noEntity')}</div>;
  }

  const enrichments = await heritageObjectEnrichmentFetcher.getById(id);
  useObject.setState({objectId: object.id, locale, enrichments});
  const enrichmentsAboutName = enrichments?.filter(
    enrichment => enrichment.type === HeritageObjectEnrichmentType.Name
  );

  let organization;
  if (object.isPartOf?.publisher?.id) {
    organization = await organizations.getById({
      id: object.isPartOf.publisher.id,
      locale,
    });
    organization && useObject.setState({organization});
  }

  const galleryImages =
    object.images?.map((image, i) => ({
      id: image.id,
      src: image.contentUrl,
      alt: `${object.name} #${i + 1}`,
      license: image.license,
    })) ?? [];

  return (
    <>
      <div className="flex flex-col gap-8 grow">
        <div className="bg-consortium-blue-800 text-white w-full">
          <div className="px-4 sm:px-10 flex gap-2 flex-row sm:justify-between max-w-[1800px] mx-auto pt-10">
            <div>
              <ToFilteredListButton
                baseUrl="/objects"
                className="no-underline rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm bg-consortium-blue-100 text-consortium-blue-800 flex gap-1 items-center"
              >
                <ChevronLeftIcon className="w-4 h-4 fill-consortium-blue-800" />
                {t('backButton')}
              </ToFilteredListButton>
            </div>
            <div className="sm:flex justify-end gap-4 hidden">
              <ObjectListsMenu objectId={id} />
            </div>
          </div>

          <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto py-10 md:pt-10 md:pb-20 xt:py-35 xl:pb-40 flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <div className="text-sm text-consortium-blue-100 mb-4 lg:mb-10 flex gap-1">
                <ObjectIcon className='w-5 h-5 stroke-consortium-blue-100"' />
                {t('object')}
              </div>
              <h1
                className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl max-w-5xl"
                data-testid="page-title"
                tabIndex={0}
              >
                {object.name || (
                  <span className="text-consortium-blue-100">
                    {t('noName')}
                  </span>
                )}
              </h1>

              <div className="text-consortium-blue-100 mt-4 lg:mt-10 flex flex-col sm:flex-row gap-5 lg:gap-10">
                {enrichmentsAboutName?.slice(0, 3).map(enrichment => (
                  <div key={enrichment.id} className="font-semibold text-white">
                    <div>{enrichment.description}</div>
                    <div className="text-sm font-normal text-consortium-blue-100">
                      {ISO6391.getName(enrichment.inLanguage as LanguageCode)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3 xl:w-1/4 text-sm text-consortium-blue-100 lg:pt-16">
              {organization && (
                <>
                  <div className="italic">{t('providerCurrentHolder')}</div>
                  <div className="text-white">{organization.name}</div>
                  <div className="mb-4">
                    {organization.address?.addressLocality}
                  </div>
                  <a href="#provider" className="p-4 -ml-4 italic" tabIndex={0}>
                    {t('providerInfo')}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full px-4 sm:px-10">
          <main className="w-full md:w-2/3 order-2 md:order-1">
            <Notifications />
            <div className="mb-4 mt-10 flex justify-between">
              <h2 className="text-2xl" tabIndex={0}>
                {t('metadata')}
              </h2>
            </div>
            <div className="flex flex-col gap-8 self-stretch">
              <Metadata
                translationKey="name"
                enrichmentType={HeritageObjectEnrichmentType.Name}
              >
                <ReadMoreText text={object.name} />
              </Metadata>

              <Metadata
                translationKey="description"
                enrichmentType={HeritageObjectEnrichmentType.Description}
              >
                <ReadMoreText text={object.description} />
              </Metadata>

              <Metadata
                translationKey="locationsCreated"
                enrichmentType={HeritageObjectEnrichmentType.LocationCreated}
              >
                {object.locationsCreated?.map(locationCreated => (
                  <div key={locationCreated.id}>
                    {locationCreated.name}
                    {locationCreated?.isPartOf?.name &&
                      ` (${locationCreated?.isPartOf?.name})`}
                  </div>
                ))}
              </Metadata>

              <Metadata
                translationKey="materials"
                enrichmentType={HeritageObjectEnrichmentType.Material}
              >
                {object.materials?.map(material => (
                  <div key={material.id}>{material.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="dateCreated"
                enrichmentType={HeritageObjectEnrichmentType.DateCreated}
              >
                {object.dateCreated && formatDateRange(object.dateCreated)}
              </Metadata>

              <Metadata
                translationKey="types"
                enrichmentType={HeritageObjectEnrichmentType.Type}
              >
                {object.types?.map(type => (
                  <div key={type.id}>{type.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="techniques"
                enrichmentType={HeritageObjectEnrichmentType.Technique}
              >
                {object.techniques?.map(technique => (
                  <div key={technique.id}>{technique.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="creators"
                enrichmentType={HeritageObjectEnrichmentType.Creator}
              >
                {object.creators?.map(creator => (
                  <div key={creator.id}>{creator.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="inscriptions"
                enrichmentType={HeritageObjectEnrichmentType.Inscription}
              >
                {object.inscriptions?.map(inscription => (
                  <div key={inscription}>{inscription}</div>
                ))}
              </Metadata>
            </div>
            <LocalContextsNotices />
          </main>
          <aside className="w-full md:w-1/3 self-stretch order-1 md:order-2  md:mx-0 md:bg-neutral-100 p-1">
            {galleryImages.length > 0 && (
              <div className="flex flex-row md:flex-col gap-1 sticky top-4">
                <Gallery
                  images={galleryImages}
                  organizationName={organization?.name}
                />
              </div>
            )}
          </aside>
        </div>
        <Provenance objectId={id} />
        {organization && (
          <div className="w-full">
            <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
              <div className="mt-10" id="provider">
                <h2 className="text-xl mt-4" tabIndex={0}>
                  {t('dataProviderTitle')}
                </h2>
                <div className="flex flex-col md:flex-row mt-4">
                  <div className="w-full md:w-1/2">
                    <div className="mb-4">{t('dataProviderDescription')}</div>
                    <p>
                      <strong>{organization.name}</strong>
                      {organization.address && (
                        <>
                          <br />
                          {organization.address?.streetAddress}
                          <br />
                          {organization.address?.postalCode}{' '}
                          {organization.address?.addressLocality}
                          <br />
                          {organization.address?.addressCountry}
                        </>
                      )}
                    </p>
                    {organization.url && (
                      <>
                        <div className="mt-4 font-semibold">
                          {t('websiteLabel')}
                        </div>
                        <a href={organization.url}>{organization.url}</a>
                      </>
                    )}
                    <br />
                    <div className="mt-4 font-semibold">
                      {t('objectIdLabel')}
                    </div>
                    <div>{object.identifier}</div>
                    {object.isPartOf && (
                      <div className="mt-4 font-semibold">
                        <a
                          href={`${
                            env['DATASET_BROWSER_URL']
                          }/datasets/${encodeURIComponent(object.isPartOf.id)}`}
                          target="_blank"
                        >
                          {t('linkToDatasetBrowser')}
                        </a>
                        <br />
                      </div>
                    )}
                  </div>
                  {organization.address && (
                    <div className="w-full md:w-1/2 mt-6 md:mt-0 h-[300px] md:h-[400px] lg:h-[500px]">
                      <Map address={organization.address} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
