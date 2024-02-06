import {useLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
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
import SignedIn from '@/lib/community/signed-in';
import {fetcher} from '@/lib/enricher-instances';
import {AdditionalType} from '@colonial-collections/enricher';
import ISO6391 from 'iso-639-1-dir';
import {LanguageCode} from 'iso-639-1-dir/dist/data';
import Provenance from './(provenance)/overview';
import {getFormatDate} from '@/lib/date-formatter/actions';
import {LocaleEnum} from '@/definitions';

export const dynamic = 'force-dynamic';

interface Props {
  params: {id: string};
}

export default async function Details({params}: Props) {
  const id = decodeRouteSegment(params.id);
  const locale = useLocale() as LocaleEnum;
  const object = await heritageObjects.getById({id, locale});
  const t = await getTranslations('ObjectDetails');
  const {formatDate} = await getFormatDate();

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
      <div className="flex flex-col gap-8 pb-40">
        <div className="bg-consortiumBlue-800 text-white w-full">
          <div className="px-4 sm:px-10 flex gap-2 flex-row sm:justify-between max-w-[1800px] mx-auto pt-10">
            <div>
              <ToFilteredListButton
                baseUrl="/objects"
                className="no-underline rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm bg-consortiumBlue-100 text-consortiumBlue-800 flex gap-1 items-center"
              >
                <ChevronLeftIcon className="w-4 h-4 fill-consortiumBlue-800" />
                {t('backButton')}
              </ToFilteredListButton>
            </div>
            <div className="sm:flex justify-end gap-4 hidden">
              <SignedIn>
                <ObjectListsMenu objectId={id} />
              </SignedIn>
            </div>
          </div>

          <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto py-10 md:pt-10 md:pb-20 xt:py-35 xl:pb-40 flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <div className="text-sm text-consortiumBlue-100 mb-4 lg:mb-10 flex gap-1">
                <ObjectIcon className='w-5 h-5 stroke-consortiumBlue-100"' />
                {t('object')}
              </div>
              <h1
                className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl max-w-5xl"
                data-testid="page-title"
              >
                {object.name || (
                  <span className="text-consortiumBlue-100">{t('noName')}</span>
                )}
              </h1>

              <div className="text-consortiumBlue-100 mt-4 lg:mt-10 flex flex-col sm:flex-row gap-5 lg:gap-10">
                {enrichmentsAboutName?.slice(0, 3).map(enrichment => (
                  <div key={enrichment.id} className="font-semibold text-white">
                    <div>{enrichment.description}</div>
                    <div className="text-sm font-normal text-consortiumBlue-100">
                      {ISO6391.getName(enrichment.inLanguage as LanguageCode)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3 xl:w-1/4 text-sm text-consortiumBlue-100 lg:pt-16">
              {organization && (
                <>
                  <div className="italic">{t('providerCurrentHolder')}</div>
                  <div className="text-white">{organization.name}</div>
                  <div className="mb-4">
                    {organization.address?.addressLocality}
                  </div>
                  <a href="#provider" className="p-4 -ml-4 italic">
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
              <h2 className="text-2xl">{t('metadata')}</h2>
            </div>
            <div className="flex flex-col gap-8 self-stretch">
              <Metadata
                translationKey="name"
                enrichmentType={AdditionalType.Name}
              >
                {object.name}
              </Metadata>

              <Metadata
                translationKey="description"
                enrichmentType={AdditionalType.Description}
              >
                {object.description}
              </Metadata>

              <Metadata
                translationKey="locationsCreated"
                enrichmentType={AdditionalType.LocationCreated}
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
                enrichmentType={AdditionalType.Material}
              >
                {object.materials?.map(material => (
                  <div key={material.id}>{material.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="dateCreated"
                enrichmentType={AdditionalType.DateCreated}
              >
                {object.dateCreated && (
                  <div className="flex flex-row gap-12">
                    <div>
                      <div className="italic text-sm text-neutral-600">
                        {t('beginOfRange')}
                      </div>
                      <div>
                        {object.dateCreated.startDate &&
                          formatDate(object.dateCreated.startDate)}
                      </div>
                    </div>
                    <div>
                      <div className="italic text-sm text-neutral-600">
                        {t('endOfRange')}
                      </div>
                      <div>
                        {object.dateCreated.endDate &&
                          formatDate(object.dateCreated.endDate)}
                      </div>
                    </div>
                  </div>
                )}
              </Metadata>

              <Metadata
                translationKey="types"
                enrichmentType={AdditionalType.Type}
              >
                {object.types?.map(type => (
                  <div key={type.id}>{type.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="techniques"
                enrichmentType={AdditionalType.Technique}
              >
                {object.techniques?.map(technique => (
                  <div key={technique.id}>{technique.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="creators"
                enrichmentType={AdditionalType.Creator}
              >
                {object.creators?.map(creator => (
                  <div key={creator.id}>{creator.name}</div>
                ))}
              </Metadata>

              <Metadata
                translationKey="inscriptions"
                enrichmentType={AdditionalType.Inscription}
              >
                {object.inscriptions?.map(inscription => (
                  <div key={inscription}>{inscription}</div>
                ))}
              </Metadata>
            </div>
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
      </div>
    </>
  );
}
