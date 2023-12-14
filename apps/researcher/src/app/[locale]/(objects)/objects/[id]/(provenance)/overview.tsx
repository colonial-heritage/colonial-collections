import provenanceEvents from '@/lib/povenance-events-instance';
import ProvenanceEventsDataTable from './data-table';
import {getTranslations} from 'next-intl/server';
import {sortEvents} from './sort-events';
import {SelectedEventProvider} from './selected-event';

export default async function Provenance({objectId}: {objectId: string}) {
  const events = await provenanceEvents.getByHeritageObjectId(objectId);
  const t = await getTranslations('Provenance');

  if (!events) {
    return (
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
          <h2 id="provenance" className="text-2xl mb-2 mt-20">
            {t('title')}
          </h2>
          <p className="text-consortiumBlue-50 text-sm max-w-2xl mb-6">
            {t('description')}
          </p>
          <p className="text-consortiumBlue-50 text-sm max-w-2xl mb-6">
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
    <SelectedEventProvider>
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-10 max-w-[1800px]">
          <h2 id="provenance" className="text-2xl mb-2 mt-20">
            {t('title')}
          </h2>
          <p className="text-consortiumBlue-50 text-sm max-w-2xl mb-6">
            {t('description')}
          </p>
          {labeledEvents.length > 0 ? (
            <ProvenanceEventsDataTable events={labeledEvents} />
          ) : null}
        </div>
      </div>
    </SelectedEventProvider>
  );
}
