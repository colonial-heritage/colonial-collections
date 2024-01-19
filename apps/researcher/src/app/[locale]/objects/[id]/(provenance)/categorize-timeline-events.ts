import {LabeledProvenanceEvent, TimeLineEvent} from './definitions';

interface CategorizedEvents {
  rangeEvents: TimeLineEvent[];
  singleEvents: TimeLineEvent[];
  eventsWithoutDates: LabeledProvenanceEvent[];
}

// Events within one event group are rendered as a single timeline event,
// because they have the same start and end date.
// Timeline events can be categorized into three groups,
// The groups are rendered differently in the timeline.
// The three groups are:
// 1. Range events: Events that have a start and end date,
// and the start and end date are different.
// 2. Single events: Events that have a single start or end date,
// or events that have the same start and end date.
// 3. Events without dates: Events that have no start or end date.
export function categorizeEvents(eventGroups: {
  [label: string]: LabeledProvenanceEvent[];
}) {
  return Object.entries(eventGroups).reduce<CategorizedEvents>(
    (categorizedEvents, [id, eventGroups]) => {
      // All events in the group have the same dates, so we can just take the first one
      const firstEvent = eventGroups[0];
      if (!firstEvent.startDate && !firstEvent.endDate) {
        return {
          ...categorizedEvents,
          eventsWithoutDates: [
            ...categorizedEvents.eventsWithoutDates,
            ...eventGroups,
          ],
        };
      } else {
        const timelineEvent = {
          // The timeline plugin expects both a start and end date
          id,
          startDate: (firstEvent.startDate || firstEvent.endDate) as Date,
          endDate: (firstEvent.endDate || firstEvent.startDate) as Date,
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

export function getEarliestDate(events: LabeledProvenanceEvent[]): Date {
  return events.reduce((earliestDate, event) => {
    if (event.startDate && event.startDate < earliestDate) {
      return event.startDate;
    }
    return earliestDate;
  }, new Date());
}
