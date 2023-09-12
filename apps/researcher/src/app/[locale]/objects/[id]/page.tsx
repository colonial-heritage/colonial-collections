import {useLocale, useTranslations} from 'next-intl';
import {getTranslator} from 'next-intl/server';
import heritageObjects from '@/lib/heritage-objects-instance';
import Gallery from './gallery';
import {ToFilteredListButton} from 'ui/list';
import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import {ObjectIcon} from '@/components/icons';
import {MetadataContainer, MetadataEntry} from './metadata';
import {decodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import organizations from '@/lib/organizations-instance';
import {
  SlideOverDialog,
  SlideOverOpenButton,
  SlideOverHeader,
  SlideOverContent,
  SlideOver,
} from 'ui';
import useCurrentPublisher from './useCurrentPublisher';

// Revalidate the page
export const revalidate = 0;

interface Props {
  params: {id: string};
}

function ContactDetailsSlideOver({datasetId}: {datasetId?: string}) {
  const organization = useCurrentPublisher.getState();
  const t = useTranslations('ObjectDetails');

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
                process.env['DATASET_BROWSER_URL']
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
  const t = await getTranslator(locale, 'ObjectDetails');

  if (!object) {
    return <div data-testid="no-entity">{t('noEntity')}</div>;
  }

  let organization;
  if (object.isPartOf?.publisher?.id) {
    organization = await organizations.getById(object.isPartOf.publisher.id);
    organization && useCurrentPublisher.setState({organization});
  }

  const galleryImages =
    object.images?.map((image, i) => ({
      id: image.id,
      src: image.contentUrl,
      alt: `${object.name} #${i + 1}`,
    })) ?? [];

  return (
    <>
      <div className="px-4 sm:px-10 -mt-3 -mb-3 sm:-mb-9 flex gap-2 flex-row sm:justify-between">
        <div>
          <ToFilteredListButton className="flex items-center gap-1" baseUrl="/">
            <ChevronLeftIcon className="w-4 h-4 fill-neutral-500" />
            {t('backButton')}
          </ToFilteredListButton>
        </div>
        <div className="sm:flex justify-end gap-4 hidden">
          <button className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-sand-100 hover:bg-sand-200 transition text-sand-800 flex items-center gap-1">
            {t('bookmarkButton')}
          </button>
          <button className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-sand-100 hover:bg-sand-200 transition text-sand-800 flex items-center gap-1">
            {t('shareButton')}
          </button>
          <select className="p-1 sm:py-2 sm:px-3 rounded-xl text-xs bg-sand-100  text-sand-800 flex items-center gap-1">
            <option className="p-2">{t('addToListButton')}</option>
            <option className="p-2">{t('createNewListButton')}</option>
          </select>
        </div>
      </div>

      <div className="px-4 sm:px-10 my-4 flex flex-col gap-4">
        <h1
          className="flex flex-row gap-4 gap-y-2 items-start flex-wrap text-2xl md:text-3xl"
          data-testid="page-title"
        >
          {object.name}
        </h1>

        <div className="text-neutral-500 text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex flex-row justify-start  gap-1 ">
            <span className="-ml-4 sm:ml-0">
              <ObjectIcon className='w-5 h-5 stroke-neutral-500"' />
            </span>
            <span className="inline items-center flex-row flex-wrap gap-1">
              {t('object')}
              {organization && (
                <>
                  <SlideOver>
                    <SlideOverOpenButton>
                      {', '}
                      <span className="inline items-start sm:items-center flex-wrap gap-1 hover:underline">
                        <strong className="text-left text-sky-700 cursor-pointer">
                          {organization.name}
                        </strong>
                        {organization.address && (
                          <>
                            <span className="hidden sm:inline px-1">-</span>
                            <span>{organization.address?.addressLocality}</span>
                          </>
                        )}
                        <span className="text-left text-sky-700 cursor-pointer pl-2">
                          ({t('contactInfo')})
                        </span>
                      </span>
                    </SlideOverOpenButton>
                    <ContactDetailsSlideOver datasetId={object.isPartOf?.id} />
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
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full mx-auto px-4 sm:px-10">
        <main className="w-full md:w-2/3 order-2 md:order-1">
          <div className=" mb-4 mt-10 flex justify-between">
            <h2 className="text-2xl">{t('metadata')}</h2>
          </div>
          <div className="flex flex-col gap-8 self-stretch">
            <MetadataContainer identifier="description">
              <MetadataEntry isCurrentPublisher>
                {object.description}
              </MetadataEntry>
            </MetadataContainer>

            <MetadataContainer identifier="materials">
              <MetadataEntry isCurrentPublisher>
                {object.materials?.map(material => (
                  <div key={material.id}>{material.name}</div>
                ))}
              </MetadataEntry>
            </MetadataContainer>

            <MetadataContainer identifier="types">
              <MetadataEntry isCurrentPublisher>
                {object.types?.map(type => (
                  <div key={type.id}>{type.name}</div>
                ))}
              </MetadataEntry>
            </MetadataContainer>

            <MetadataContainer identifier="techniques">
              <MetadataEntry isCurrentPublisher>
                {object.techniques?.map(technique => (
                  <div key={technique.id}>{technique.name}</div>
                ))}
              </MetadataEntry>
            </MetadataContainer>

            <MetadataContainer identifier="creators">
              <MetadataEntry isCurrentPublisher>
                {object.creators?.map(creator => (
                  <div key={creator.id}>{creator.name}</div>
                ))}
              </MetadataEntry>
            </MetadataContainer>

            <MetadataContainer identifier="inscriptions">
              <MetadataEntry isCurrentPublisher>
                {object.inscriptions?.map(inscription => (
                  <div key={inscription}>{inscription}</div>
                ))}
              </MetadataEntry>
            </MetadataContainer>
          </div>
        </main>
        <aside className="w-full md:w-1/3 self-stretch order-1 md:order-2  md:mx-0 md:bg-neutral-100 p-1">
          {galleryImages.length > 0 && (
            <div className="flex flex-row md:flex-col gap-1 sticky top-4">
              <Gallery images={galleryImages} />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
