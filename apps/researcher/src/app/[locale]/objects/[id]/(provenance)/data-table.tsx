'use client';

import {SlideOut, SlideOutButton} from '@colonial-collections/ui';
import type {LabeledProvenanceEvent} from './definitions';
import {useTranslations} from 'next-intl';
import {useProvenance} from './provenance-store';
import {SelectEventsButton} from './buttons';
import {XMarkIcon} from '@heroicons/react/24/outline';

interface Props {
  organizationName?: string;
}

export default function DataTable({organizationName}: Props) {
  const t = useTranslations('Provenance');

  const {
    selectedEvents,
    setSelectedEvents,
    eventGroupsFiltered,
    showDataTable,
  } = useProvenance();

  if (!showDataTable) {
    return null;
  }

  function showAllClick() {
    setSelectedEvents([]);
  }

  return (
    <div className="w-full block">
      <div className="flex justify-between items-center">
        <h3 className="my-4 w-full pt-4">{t('dataTableTitle')}</h3>
        <div className="flex items-center text-consortiumBlue-800 ">
          {selectedEvents.length > 0 && (
            <button
              onClick={showAllClick}
              className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumBlue-100 hover:bg-consortiumBlue-50 text-neutral-800 transition flex items-center gap-1 mr-2 whitespace-nowrap"
            >
              {t('showAll')}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {Object.entries(eventGroupsFiltered).map(([dateRange, eventGroup]) => (
          <ProvenanceEventRow
            organizationName={organizationName}
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
  organizationName?: string;
}

function ProvenanceEventRow({
  provenanceEvents,
  dateRange,
  organizationName,
}: ProvenanceEventRowProps) {
  const t = useTranslations('Provenance');

  return (
    <div className="flex flex-col md:flex-row gap-4 border-t">
      <div className="w-1/3 lg:w-1/4 py-2">
        <div className="sticky top-8">{dateRange}</div>
      </div>
      <div className="flex flex-col gap-4 w-2/3 lg:w-3/4 ">
        {provenanceEvents.map(event => (
          <div
            key={event.id}
            className="flex flex-col md:flex-row justify-between gap-4 border-b last:border-b-0 py-2"
          >
            <div>
              <SelectEventsButton ids={[event.id]}>
                {event.label}
              </SelectEventsButton>
            </div>
            <div className="w-2/3">
              <div>
                {t('transferredTo')}{' '}
                <strong>{event.transferredTo?.name}</strong>
              </div>
              {event.transferredFrom && (
                <div>
                  {t('transferredFrom')}{' '}
                  <strong>{event.transferredFrom?.name}</strong>
                </div>
              )}
              {event.location && (
                <div>
                  {t('location')} <strong>{event.location.name}</strong>
                </div>
              )}
              {event.description && (
                <>
                  <SlideOutButton
                    id={`eventDescription-${event.id}`}
                    className="italic underline mt-2"
                  >
                    {t('readMore')}
                  </SlideOutButton>
                  <SlideOut id={`eventDescription-${event.id}`}>
                    <div className="flex-col max-w-2xl">
                      <div className="w-full flex justify-end">
                        <SlideOutButton
                          id={`eventDescription-${event.id}`}
                          className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
                        >
                          <XMarkIcon className="w-4 h-4 stroke-neutral-900" />
                        </SlideOutButton>
                      </div>
                      {event.description}
                    </div>
                  </SlideOut>
                </>
              )}
            </div>
            <div className="w-1/3 text-xs">
              <div>
                {t('providedBy')} <strong>{organizationName}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
