'use client';

import {SlideOut, useSlideOut} from '@colonial-collections/ui';
import type {LabeledProvenanceEvent} from './definitions';
import {useLocale, useTranslations} from 'next-intl';
import {groupByDateRange} from './group-events';
import {useProvenance} from './provenance-store';
import {SelectEventsButton} from './buttons';

export default function DataTable() {
  const t = useTranslations('Provenance');
  const locale = useLocale();

  const {selectedEvents, setSelectedEvents, events, showDataTable} =
    useProvenance();

  if (!showDataTable) {
    return null;
  }

  function showAllClick() {
    setSelectedEvents([]);
  }

  const eventsToShow =
    selectedEvents.length > 0
      ? selectedEvents.map(id => events.find(event => event.id === id)!)
      : events;

  const eventGroups = groupByDateRange({events: eventsToShow, locale});

  return (
    <div className="w-full block">
      <div className="flex justify-between items-center">
        <h3 className="my-4 w-full pt-4">{t('dataTableTitle')}</h3>
        <div className="flex items-center text-consortiumBlue-800 ">
          {selectedEvents.length > 0 && (
            <button
              onClick={showAllClick}
              className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1 mr-2 whitespace-nowrap"
            >
              {t('showAll')}
            </button>
          )}
        </div>
      </div>
      <div className="py-2 rounded bg-consortiumBlue-900">
        <header className="text-sm pl-8 w-full flex flex-col gap-2 sm:flex-row justify-between py-2 border-b border-consortiumBlue-300 mb-4 text-consortiumBlue-100">
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
            provenanceEvents={eventGroup}
          />
        ))}
      </div>
    </div>
  );
}

interface ProvenanceEventRowProps {
  provenanceEvents: LabeledProvenanceEvent[];
  dateRange: string;
}

function ProvenanceEventRow({
  provenanceEvents,
  dateRange,
}: ProvenanceEventRowProps) {
  const t = useTranslations('Provenance');
  const {setIsVisible, isVisible} = useSlideOut();

  return (
    <div className="border-l-4 mb-16 border-consortiumBlue-950">
      <div className="mb-4 pl-4">
        <strong>{dateRange || t('noDate')}</strong>
      </div>
      <ul className="flex flex-col border-t border-consortiumBlue-500">
        {provenanceEvents.map(event => (
          <li
            key={event.id}
            className="list-none pl-4 w-full text-sm md:text-base border-b border-consortiumBlue-700 hover:bg-consortiumBlue-600 hover:cursor-pointer"
            onClick={() =>
              setIsVisible(
                `eventDescription-${event.id}`,
                !isVisible(`eventDescription-${event.id}`)
              )
            }
          >
            <div
              id={`eventDescription-${event.id}`}
              className="w-full flex flex-col gap-2 lg:gap-4 sm:flex-row justify-between items-center py-2"
            >
              <>
                <div className="w-full md:w-1/12 flex flex-col lg:flex-row items-center gap-2">
                  <div className="flex flex-col gap-2">
                    <div>
                      <SelectEventsButton ids={[event.id]}>
                        {event.label}
                      </SelectEventsButton>
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
              </>
            </div>
            <SlideOut id={`eventDescription-${event.id}`}>
              <div className="w-full py-2 block" id="showProvDescrip">
                <div className="w-full max-w-2xl flex flex-col">
                  <strong>{t('descriptionTitle')}</strong>
                  {event.description || t('noDescription')}
                </div>
              </div>
            </SlideOut>
          </li>
        ))}
      </ul>
    </div>
  );
}
