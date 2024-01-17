import {LabeledProvenanceEvent} from './definitions';

interface CategorizedEvents {
  rangeEvents: LabeledProvenanceEvent[];
  singleEvents: LabeledProvenanceEvent[];
  eventsWithoutDates: LabeledProvenanceEvent[];
}

// Timeline events can be categorized into three groups,
// The groups are rendered differently in the timeline.
// The three groups are:
// 1. Range events: Events that have a start and end date,
// and the start and end date are different.
// 2. Single events: Events that have a single start or end date,
// or events that have the same start and end date.
// 3. Events without dates: Events that have no start or end date.
export function categorizeEvents(events: LabeledProvenanceEvent[]) {
  return events.reduce<CategorizedEvents>(
    (categorizedEvents, event) => {
      if (!event.startDate && !event.endDate) {
        return {
          ...categorizedEvents,
          eventsWithoutDates: [...categorizedEvents.eventsWithoutDates, event],
        };
      } else if (
        event.startDate &&
        event.endDate &&
        event.startDate.getTime() !== event.endDate.getTime()
      ) {
        return {
          ...categorizedEvents,
          rangeEvents: [...categorizedEvents.rangeEvents, event],
        };
      } else {
        return {
          ...categorizedEvents,
          singleEvents: [...categorizedEvents.singleEvents, event],
        };
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
