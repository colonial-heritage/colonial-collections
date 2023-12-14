import {SlideOut, SlideOutButton} from '@colonial-collections/ui';
import type {LabeledProvenanceEvent} from './definitions';
import {useLocale, useTranslations} from 'next-intl';
import {InformationCircleIcon} from '@heroicons/react/24/outline';
import {groupByDateRange} from './group-events';
import {SelectEventButton} from './selected-event';

export default function ProvenanceEventsDataTable({
  events,
}: {
  events: LabeledProvenanceEvent[];
}) {
  const t = useTranslations('Provenance');
  const locale = useLocale();

  const eventGroups = groupByDateRange({events, locale});

  return (
    <div className="py-2 rounded bg-blueGrey-50">
      <header className="text-sm pl-8 w-full flex flex-col gap-2 sm:flex-row justify-between py-2 border-b mb-4 text-blueGrey-600">
        <div className="w-full md:w-1/12">{t('id')}</div>
        <div className="w-full md:w-2/12">{t('type')}</div>
        <div className="w-full md:w-3/12">{t('transferredFrom')}</div>
        <div className="w-full md:w-3/12">{t('transferredTo')}</div>
        <div className="w-full md:w-1/12">{t('location')}</div>
      </header>
      {Object.entries(eventGroups).map(([dateRange, eventGroup]) => (
        <ProvenanceEventRow
          key={dateRange}
          dateRange={dateRange}
          eventGroup={eventGroup}
        />
      ))}
    </div>
  );
}

function ProvenanceEventRow({
  eventGroup,
  dateRange,
}: {
  eventGroup: LabeledProvenanceEvent[];
  dateRange: string;
}) {
  const t = useTranslations('Provenance');

  return (
    <div className="border-l-4 mb-16 border-consortiumBlue-970">
      <div className="mb-4 pl-4">
        <strong>{dateRange}</strong>
      </div>
      <ul className="flex flex-col border-t border-consortiumBlue-970">
        {eventGroup.map(event => (
          <li
            key={event.id}
            className="list-none pl-4 w-full text-sm md:text-base border-b border-blueGrey-100"
          >
            <div className="w-full flex flex-col gap-2 lg:gap-4 sm:flex-row justify-between items-center py-2">
              <div className="w-full md:w-1/12 flex flex-col lg:flex-row items-center gap-2">
                <div className="flex flex-col gap-2">
                  <div>
                    <SelectEventButton
                      event={event}
                      className="bg-white hover:bg-neutral-700 border-neutral-700 hover:border-neutral-700 hover:text-white rounded-full h-8 w-8 flex justify-center items-center border-2 transition text-xs font-medium hover:z-40"
                    >
                      {event.label}
                    </SelectEventButton>
                    {event.description && (
                      <SlideOutButton
                        id={`eventDescription-${event.id}`}
                        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
                      >
                        <InformationCircleIcon className="w-5 h-5 stroke-blueGrey-700" />
                      </SlideOutButton>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/12">
                <div>{event.types?.map(type => type.name).join(', ')}</div>
              </div>
              <div className="w-full md:w-3/12">
                {event.transferredFrom?.name}
              </div>
              <div className="w-full md:w-3/12">
                {event.transferredTo?.name}
              </div>
              <div className="w-full md:w-1/12">{event.location?.name}</div>
            </div>
            {event.description && (
              <SlideOut id={`eventDescription-${event.id}`}>
                <div className="w-full py-2 block" id="showProvDescrip">
                  <div className="w-full max-w-2xl flex flex-col">
                    <strong>{t('descriptionTitle')}</strong>
                    {event.description}
                  </div>
                </div>
              </SlideOut>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
