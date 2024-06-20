'use client';

import {SlideOut, SlideOutButton} from '@colonial-collections/ui';
import type {UserProvenanceEvent} from './definitions';
import {useTranslations} from 'next-intl';
import {useProvenance} from './provenance-store';
import {SelectEventsButton} from './buttons';
import {ExclamationTriangleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {ProvidedBy} from '../provided-by';
import Language from '../language';

export default function DataTable() {
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
        <div className="flex items-center text-consortium-blue-800 ">
          {selectedEvents.length > 0 && (
            <button
              onClick={showAllClick}
              className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortium-blue-100 hover:bg-consortium-blue-50 text-neutral-800 transition flex items-center gap-1 mr-2 whitespace-nowrap"
            >
              {t('showAll')}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {Object.entries(eventGroupsFiltered).map(([dateRange, eventGroup]) => (
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
  provenanceEvents: UserProvenanceEvent[];
  dateRange: string;
}

const metadata: ReadonlyArray<{
  prop: keyof UserProvenanceEvent;
  translationKey: string;
}> = [
  {prop: 'transferredToName', translationKey: 'transferredTo'},
  {prop: 'transferredFromName', translationKey: 'transferredFrom'},
  {prop: 'typeName', translationKey: 'type'},
  {prop: 'locationName', translationKey: 'location'},
];

function ProvenanceEventRow({
  provenanceEvents,
  dateRange,
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
              {metadata.map(
                ({prop, translationKey}) =>
                  event[prop] && (
                    <div key={prop}>
                      {t(translationKey)}{' '}
                      <strong>{event[prop] as string}</strong>
                    </div>
                  )
              )}
              {event.qualifierName && (
                <div className="text-sm text-neutral-600 flex items-center gap-1 italic mt-1">
                  <ExclamationTriangleIcon className="w-4 h-4 stroke-neutral-600" />
                  {t.rich('qualifier', {
                    qualifier: () => event.qualifierName,
                  })}
                </div>
              )}
              {event.motivations && (
                <>
                  <SlideOutButton
                    hideIfOpen
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
                      {Object.entries(event.motivations).map(
                        ([key, motivation]) => (
                          <div key={key} className="mb-3">
                            <div className="font-bold mb-1">{key}</div>
                            <div>{motivation}</div>
                          </div>
                        )
                      )}
                      {event.inLanguage && (
                        <Language languageCode={event.inLanguage} />
                      )}
                    </div>
                  </SlideOut>
                </>
              )}
            </div>
            <div className="w-1/3 text-xs">
              <ProvidedBy
                dateCreated={event.dateCreated}
                citation={event.citation}
                name={event.creatorName}
                communityName={event.communityName}
                id={event.id}
                isCurrentPublisher={event.isCurrentPublisher}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
