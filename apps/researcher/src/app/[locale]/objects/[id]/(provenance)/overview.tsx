import {useLocale} from 'next-intl';
import provenanceEvents from '@/lib/provenance-events-instance';
import DataTable from './data-table';
import {getTranslations} from 'next-intl/server';
import {sortEvents} from './sort-events';
import {ProvenanceProvider} from './provenance-store';
import {ToggleViewButtons} from './buttons';
import {LocaleEnum} from '@/definitions';
import useObject from '../use-object';
import dynamic from 'next/dynamic';

// SSR needs to be false for plugin 'react-headless-timeline'
const Timeline = dynamic(() => import('./timeline'), {
  ssr: false,
});

export default async function Provenance({objectId}: {objectId: string}) {
  const locale = useLocale() as LocaleEnum;
  const events = await provenanceEvents.getByHeritageObjectId({
    id: objectId,
    locale,
  });
  const t = await getTranslations('Provenance');
  const {organization} = useObject.getState();

  if (!events || events.length === 0) {
    return (
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
          <h2 id="provenance" className="text-2xl mb-2 mt-20">
            {t('title')}
          </h2>
          <p className="text-neutral-600 text-sm max-w-2xl mb-6">
            {t('description')}
          </p>
          <p className="text-neutral-600 text-sm max-w-2xl mb-6">
            {t('noData')}
          </p>
        </div>
      </div>
    );
  }

  const sortedEvents = sortEvents(events);
  const labeledEvents = sortedEvents?.map((event, index) => ({
    ...event,
    label: `${t('initial')}${index + 1}`,
  }));
  return (
    <ProvenanceProvider events={labeledEvents}>
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
          <h2 id="provenance" className="text-2xl mb-2 mt-20">
            {t('title')}
          </h2>
          <p className="text-neutral-600 text-sm max-w-2xl mb-6">
            {t('description')}
          </p>
          <div className="flex justify-between items-center my-6">
            <div>{/* Place 'Add provenance' button here */}</div>
            <div className=" flex gap-1">
              <ToggleViewButtons />
            </div>
          </div>
          <Timeline />
          <DataTable organizationName={organization?.name} />
        </div>
      </div>
    </ProvenanceProvider>
  );
}
