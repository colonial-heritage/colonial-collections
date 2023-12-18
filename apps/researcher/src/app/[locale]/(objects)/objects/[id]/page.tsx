import {useLocale, useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import heritageObjects from '@/lib/heritage-objects-instance';
import Gallery from './gallery';
import ToFilteredListButton from '@/components/to-filtered-list-button';
import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import {ObjectIcon} from '@/components/icons';
import {Metadata} from './metadata';
import {decodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import organizations from '@/lib/organizations-instance';
import {
  SlideOverDialog,
  SlideOverOpenButton,
  SlideOverHeader,
  SlideOverContent,
  SlideOver,
  Notifications,
} from '@colonial-collections/ui';
import useObject from './use-object';
import {env} from 'node:process';
import {formatDateRange} from './format-date-range';
import ObjectListsMenu from './object-lists-menu';
import {SignedIn} from '@clerk/nextjs';
import {fetcher} from '@/lib/enricher-instances';
import {AdditionalType} from '@colonial-collections/enricher';
import ISO6391 from 'iso-639-1-dir';
import {LanguageCode} from 'iso-639-1-dir/dist/data';
import Provenance from './(provenance)/overview';

export const dynamic = 'force-dynamic';

interface Props {
  params: {id: string};
}

function ContactDetailsSlideOver({datasetId}: {datasetId?: string}) {
  const {organization} = useObject.getState();
  const t = useTranslations('ObjectDetails');

  if (!organization) {
    return (
      <SlideOverDialog>
        <SlideOverHeader />
        <SlideOverContent>
          <div className="flex-col gap-4 mt-4 flex">
            <h2>{t('noOrganizationFound')}</h2>
          </div>
        </SlideOverContent>
      </SlideOverDialog>
    );
  }

  return (
    <SlideOverDialog>
      <SlideOverHeader />
      <SlideOverContent>
        <div className="flex-col gap-4 mt-4 flex">
          <h2>{organization.name}</h2>
          <span>
            {organization.address?.streetAddress}
            <br /> {organization.address?.postalCode}{' '}
            {organization.address?.addressLocality},
            <br /> {organization.address?.addressCountry}
          </span>
          {organization.url && (
            <a href={organization.url}>{t('linkToWebsite')}</a>
          )}{' '}
          {datasetId && (
            <a
              href={`${
                env['DATASET_BROWSER_URL']
              }/datasets/${encodeURIComponent(datasetId)}`}
            >
              {t('linkToDataset')}
            </a>
          )}
        </div>
      </SlideOverContent>
    </SlideOverDialog>
  );
}

export default async function Details({params}: Props) {
  const id = decodeRouteSegment(params.id);
  const object = await heritageObjects.getById(id);
  const locale = useLocale();
  const t = await getTranslations('ObjectDetails');

  if (!object) {
    return <div data-testid="no-entity">{t('noEntity')}</div>;
  }

  const enrichments = await fetcher.getById(id);
  useObject.setState({objectId: object.id, locale, enrichments});
  const enrichmentsAboutName = enrichments?.filter(
    enrichment => enrichment.additionalType === AdditionalType.Name
  );

  let organization;
  if (object.isPartOf?.publisher?.id) {
    organization = await organizations.getById(object.isPartOf.publisher.id);
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
      <div className="bg-consortiumBlue-800 text-white mb-16 flex flex-col gap-8 pt-9 pb-40">
        <div className="px-4 sm:px-10 flex gap-2 flex-row sm:justify-between w-full max-w-[1800px] mx-auto">
          <div>
            <ToFilteredListButton className="flex items-center gap-1 text-consortiumBlue-100">
              <ChevronLeftIcon className="w-4 h-4 fill-consortiumBlue-100" />
              {t('backButton')}
            </ToFilteredListButton>
          </div>
          <div className="sm:flex justify-end gap-4 hidden">
            <SignedIn>
              <ObjectListsMenu objectId={id} />
            </SignedIn>
          </div>
        </div>

        <div className="px-4 sm:px-10 my-4 flex flex-col gap-4 w-full bg max-w-[1800px] mx-auto">
          <h1
            className="text-2xl md:text-4xl md:items-center"
            data-testid="page-title"
          >
            {object.name}
          </h1>

          <div className="flex flex-row items-start flex-wrap">
            {enrichmentsAboutName?.slice(0, 3).map(enrichment => (
              <div
                key={enrichment.id}
                className="border-r border-consortiumBlue-400 mr-4 pr-4"
              >
                <div className="">{enrichment.description}</div>
                <div className="text-xs font-normal  hidden sm:block text-consortiumBlue-100">
                  {ISO6391.getName(enrichment.inLanguage as LanguageCode)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-consortiumBlue-100 text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex flex-row justify-start  gap-1 ">
              <span className="-ml-4 sm:ml-0">
                <ObjectIcon className='w-5 h-5 stroke-consortiumBlue-100"' />
              </span>
              <span className="inline items-center flex-row flex-wrap gap-1">
                {t('object')}
                {organization && (
                  <>
                    <SlideOver>
                      <SlideOverOpenButton>
                        {', '}
                        <span className="inline items-start sm:items-center flex-wrap gap-1 hover:underline">
                          <strong className="text-left cursor-pointer">
                            {organization.name}
                          </strong>
                          {organization.address && (
                            <>
                              <span className="hidden sm:inline px-1">-</span>
                              <span>
                                {organization.address?.addressLocality}
                              </span>
                            </>
                          )}
                          <span className="text-left cursor-pointer pl-2">
                            ({t('contactInfo')})
                          </span>
                        </span>
                      </SlideOverOpenButton>
                      <ContactDetailsSlideOver
                        datasetId={object.isPartOf?.id}
                      />
                    </SlideOver>
                  </>
                )}
              </span>
            </div>
            <div className="grow sm:text-right break-keep">
              {t('identifier', {
                identifier: object.identifier,
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full mx-auto px-4 sm:px-10 max-w-[1800px]">
          <main className="w-full md:w-2/3 order-2 md:order-1">
            <Notifications />
            <div className="mb-4 mt-10 flex justify-between">
              <h2 className="text-2xl">{t('metadata')}</h2>
            </div>
            <div className="flex flex-col gap-8 self-stretch">
              <MetadataContainer
                translationKey="name"
                enrichmentType={AdditionalType.Name}
              >
                <MetadataEntries>{object.name}</MetadataEntries>
              </MetadataContainer>
              <MetadataContainer
                translationKey="description"
                enrichmentType={AdditionalType.Description}
              >
                <MetadataEntries>{object.description}</MetadataEntries>
              </MetadataContainer>

              <MetadataContainer
                translationKey="materials"
                enrichmentType={AdditionalType.Material}
              >
                <MetadataEntries>
                  {object.materials?.map(material => (
                    <div key={material.id}>{material.name}</div>
                  ))}
                </MetadataEntries>
              </MetadataContainer>

              <MetadataContainer
                translationKey="dateCreated"
                enrichmentType={AdditionalType.DateCreated}
              >
                <MetadataEntries>
                  {object.dateCreated && (
                    <div>{formatDateCreated(object.dateCreated, locale)}</div>
                  )}
                </MetadataEntries>
              </MetadataContainer>

              <MetadataContainer
                translationKey="types"
                enrichmentType={AdditionalType.Type}
              >
                <MetadataEntries>
                  {object.types?.map(type => (
                    <div key={type.id}>{type.name}</div>
                  ))}
                </MetadataEntries>
              </MetadataContainer>

              <MetadataContainer
                translationKey="techniques"
                enrichmentType={AdditionalType.Technique}
              >
                <MetadataEntries>
                  {object.techniques?.map(technique => (
                    <div key={technique.id}>{technique.name}</div>
                  ))}
                </MetadataEntries>
              </MetadataContainer>

              <MetadataContainer
                translationKey="creators"
                enrichmentType={AdditionalType.Creator}
              >
                <MetadataEntries>
                  {object.creators?.map(creator => (
                    <div key={creator.id}>{creator.name}</div>
                  ))}
                </MetadataEntries>
              </MetadataContainer>

              <MetadataContainer
                translationKey="inscriptions"
                enrichmentType={AdditionalType.Inscription}
              >
                <MetadataEntries>
                  {object.inscriptions?.map(inscription => (
                    <div key={inscription}>{inscription}</div>
                  ))}
                </MetadataEntries>
              </MetadataContainer>
            </div>
          </main>
          <aside className="w-full md:w-1/3 self-stretch order-1 md:order-2  md:mx-0 md:bg-consortiumBlue-900 p-1">
            {galleryImages.length > 0 && (
              <div className="flex flex-row md:flex-col gap-1 sticky top-4">
                <Gallery images={galleryImages} />
              </div>
            )}
          </aside>
        </div>
      </div>
      <Provenance objectId={id} />
    </>
  );
}
