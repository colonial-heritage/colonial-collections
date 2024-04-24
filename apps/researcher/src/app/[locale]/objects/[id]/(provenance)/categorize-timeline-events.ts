import {UserProvenanceEvent, TimelineEvent} from './definitions';

interface CategorizedEvents {
  rangeEvents: TimelineEvent[];
  singleEvents: TimelineEvent[];
  eventsWithoutDates: UserProvenanceEvent[];
}

/* Events within one event group are rendered as a single timeline event,
because they have the same start and end date.
Timeline events can be categorized into three groups,
The groups are rendered differently in the timeline.
The three groups are:
1. Range events: Events that have a start and end date,
and the start and end date are different.
2. Single events: Events that have a single start or end date,
or events that have the same start and end date.
3. Events without dates: Events that have no start or end date. */
export function categorizeEvents(eventGroups: {
  [label: string]: UserProvenanceEvent[];
}) {
  return Object.entries(eventGroups).reduce<CategorizedEvents>(
    (categorizedEvents, [id, eventGroups]) => {
      // All events in the group have the same dates, so we can just take the first one
      const firstEvent = eventGroups[0];
      if (!firstEvent.date?.startDate && !firstEvent.date?.endDate) {
        return {
          ...categorizedEvents,
          eventsWithoutDates: [
            ...categorizedEvents.eventsWithoutDates,
            ...eventGroups,
          ],
        };
      } else {
        const timeSpan = firstEvent.date;
        const timelineEvent = {
          id,
          // The timeline plugin expects both a start and end date
          startDate: (timeSpan.startDate || timeSpan.endDate) as Date,
          endDate: (timeSpan.endDate || timeSpan.startDate) as Date,
          selectIds: eventGroups.map(event => event.id),
          labels: eventGroups.map(event => event.label),
        };
        if (
          timelineEvent.startDate.getTime() !== timelineEvent.endDate.getTime()
        ) {
          return {
            ...categorizedEvents,
            rangeEvents: [...categorizedEvents.rangeEvents, timelineEvent],
          };
        } else {
          return {
            ...categorizedEvents,
            singleEvents: [...categorizedEvents.singleEvents, timelineEvent],
          };
        }
      }
    },
    {
      rangeEvents: [],
      singleEvents: [],
      eventsWithoutDates: [],
    }
  );
}

export function getEarliestDate(events: UserProvenanceEvent[]): Date {
  return events.reduce((earliestDate, event) => {
    if (event.date?.startDate && event.date.startDate < earliestDate) {
      return event.date.startDate;
    }
    return earliestDate;
  }, new Date());
}
