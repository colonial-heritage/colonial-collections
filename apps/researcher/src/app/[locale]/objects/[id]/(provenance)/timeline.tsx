'use client';

import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {TimelineEvent} from './definitions';
import Timeline from 'react-headless-timeline';
import {useProvenance} from './provenance-store';
import {SelectEventsButton} from './buttons';
import {categorizeEvents, getEarliestDate} from './categorize-timeline-events';
import {groupByDateRange} from './group-events';

function TimelineButton({event}: {event: TimelineEvent}) {
  return (
    <SelectEventsButton ids={event.selectIds}>
      {event.labels.slice(0, 2).map((label, i) => {
        return (
          <span key={i}>
            {label}
            {i < event.labels.length - 1 && (
              <span className="text-neutral-400 px-1">+</span>
            )}
          </span>
        );
      })}
      {event.labels.length > 2 && <span> ... </span>}
    </SelectEventsButton>
  );
}

export default function ProvenanceTimeline() {
  const t = useTranslations('Provenance');
  const format = useFormatter();
  const {events, showTimeline} = useProvenance();
  const locale = useLocale();

  if (!showTimeline) {
    return null;
  }

  const eventGroups = groupByDateRange({events, locale});

  const {rangeEvents, singleEvents, eventsWithoutDates} =
    categorizeEvents(eventGroups);

  const earliestDate = getEarliestDate(events);

  return (
    <div className="w-full" id="provTimeline">
      <h3 className="my-2 w-full pt-4">{t('timelineTitle')}</h3>
      <div className="text-sm max-w-3xl mb-4 text-neutral-600">
        {t('timelineDescription')}{' '}
        {eventsWithoutDates.length > 0 &&
          t('timelineEventsWithoutDates', {
            eventCount: eventsWithoutDates.length,
            events: format.list(
              eventsWithoutDates.map(event => event.label),
              {type: 'conjunction'}
            ),
          })}
      </div>
      <div className="rounded-sm w-full mb-10 relative bg-neutral-50">
        <div className="overflow-y-scroll w-full">
          <div className="mb-12 rounded-sm pt-4 pb-24 pl-2 w-[1800px] pr-32 bg-neutral-50">
            <Timeline.Provider
              startDate={new Date(earliestDate.getFullYear() - 50, 0, 1)}
              endDate={new Date()}
              direction="horizontal"
            >
              <>
                <Timeline.Events
                  render={({getEventStyles}) => (
                    <div className="w-full">
                      {rangeEvents.map((event, i) => (
                        <div
                          key={i}
                          className="w-full relative h-12 border-b border-neutral-300"
                        >
                          <div
                            style={getEventStyles(event)}
                            className="h-10 mt-1 text-center flex justify-center items-center bg-consortiumBlue-500 rounded-full py-1 min-w-8"
                          >
                            <div className="absolute">
                              <TimelineButton event={event} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Timeline.Events
                  render={({getEventStyles}) => (
                    <div className="w-full">
                      <div className="w-full relative h-12 border-b border-neutral-300">
                        {singleEvents.map((event, i) => (
                          <div key={i} style={getEventStyles(event)}>
                            <div className="absolute mt-2">
                              <TimelineButton event={event} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
                <div className="w-full h-0 relative mt-8">
                  <div className="w-full border-b-2 h-4 border-neutral-600 absolute"></div>

                  <Timeline.Headers
                    cells={10}
                    render={({headers, getHeaderStyles}) => (
                      <div className="relative w-full h-8 pt-3 border-l-4 border-neutral-200">
                        {headers.map(header => (
                          <div
                            key={header.getFullYear()}
                            className="pt-10 border-l-4 border-neutral-50 -mt-3"
                            style={getHeaderStyles(header)}
                          >
                            <div className="text-sm -rotate-45 ">
                              {header.getFullYear()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </>
            </Timeline.Provider>
          </div>
        </div>
        <div className="absolute w-32 bg-gradient-to-l from-neutral-50 right-0 top-0 bottom-0"></div>
      </div>
    </div>
  );
}
