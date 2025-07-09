import provenanceEvents from '@/lib/provenance-events-instance';
import DataTable from './data-table';
import {getTranslations, getLocale} from 'next-intl/server';
import {sortEvents} from './sort-events';
import {ProvenanceProvider} from './provenance-store';
import {ToggleViewButtons} from './buttons';
import {LocaleEnum} from '@/definitions';
import dynamic from 'next/dynamic';
import {SlideOutButton, LocalizedMarkdown} from '@colonial-collections/ui';
import {XMarkIcon} from '@heroicons/react/24/outline';
import AddProvenanceForm from './add-form';
import {provenanceEventEnrichmentFetcher} from '@/lib/enricher-instances';
import {SignedInWithCommunitySideOut} from '@/components/slide-outs';
import {Notifications} from '@colonial-collections/ui';
import {transformEvents} from './transform-events';
import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';

// SSR needs to be false for plugin 'react-headless-timeline'
const Timeline = dynamic(() => import('./timeline'), {
  ssr: false,
});

export default async function Provenance({objectId}: {objectId: string}) {
  const locale = (await getLocale()) as LocaleEnum;
  const baseEvents =
    (await provenanceEvents.getByHeritageObjectId({
      id: objectId,
      locale,
    })) || [];

  const provenanceEnrichmentEvents =
    (await provenanceEventEnrichmentFetcher.getById(objectId)) || [];

  const events = [...baseEvents, ...provenanceEnrichmentEvents];

  const t = await getTranslations('Provenance');

  if (events.length === 0) {
    return (
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
          <h2 id="provenance" className="text-2xl mb-2 mt-20" tabIndex={0}>
            {t('title')}
          </h2>
          <p className="text-neutral-600 text-sm max-w-2xl mb-6">
            {t('description')}
          </p>
          <p className="text-neutral-600 text-sm max-w-2xl mb-6">
            {t('noData')}
          </p>
          <div className="flex justify-between items-center my-6">
            <div>
              <AddProvenanceButton />
            </div>
          </div>
          <AddProvenanceSlideOut objectId={objectId} />
        </div>
      </div>
    );
  }

  const sortedEvents = sortEvents(events);
  const userEvents = await transformEvents(sortedEvents);
  return (
    <ProvenanceProvider events={userEvents}>
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
          <h2
            id="provenance"
            className="text-2xl mb-2 mt-20 scroll-mt-20"
            tabIndex={0}
          >
            {t('title')}
          </h2>

          <div className="flex flex-col lg:flex-row justify-between my-6">
            <div className="flex flex-col lg:flex-row justify-between w-2/3 items-start lg:gap-8 lg:border-r ">
              <p className="text-neutral-600 text-sm max-w-xl mb-6">
                {t('description')}
              </p>
              <div className="flex justify-end items-start pr-4">
                <AddProvenanceButton />
              </div>
            </div>

            <div className="flex gap-1 w-1/3 lg:justify-end items-start">
              <ToggleViewButtons />
            </div>
          </div>
          <AddProvenanceSlideOut objectId={objectId} />
          <Timeline />
          <DataTable />
        </div>
      </div>
    </ProvenanceProvider>
  );
}

const slideOutId = 'addProvenance';

async function AddProvenanceButton() {
  const t = await getTranslations('Provenance');

  return (
    <SlideOutButton
      className="mb-4 py-2 px-3 p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortium-green-300 text-consortiumBlue-800 transition flex items-center gap-1 hover:bg-consortium-green-200 whitespace-pre"
      id={slideOutId}
    >
      <ChatBubbleBottomCenterTextIcon className="w-4 h-4 stroke-consortium-blue-800" />
      {t('addProvenanceButton')}
    </SlideOutButton>
  );
}

async function AddProvenanceSlideOut({objectId}: {objectId: string}) {
  const t = await getTranslations('Provenance');

  return (
    <>
      <Notifications prefixFilters={['provenance.']} />
      <SignedInWithCommunitySideOut
        slideOutId={slideOutId}
        needAccountTitle={t('needAccountToAddProvenanceTitle')}
        needCommunityTitle={t('needCommunityToAddProvenanceTitle')}
      >
        <div className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-300 text-neutral-800 flex-col flex">
          <div className="flex justify-between items-center border-b  -mx-4 px-4 pb-2">
            <h3 className="">{t('addProvenanceTitle')}</h3>
            <SlideOutButton
              id={slideOutId}
              className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
            >
              <XMarkIcon className="w-4 h-4 stroke-neutral-900" />
            </SlideOutButton>
          </div>
          <AddProvenanceForm
            objectId={objectId}
            slideOutId={slideOutId}
            licenceComponent={
              <LocalizedMarkdown
                name="license"
                contentPath="@/messages"
                textSize="small"
              />
            }
          />
        </div>
      </SignedInWithCommunitySideOut>
    </>
  );
}
