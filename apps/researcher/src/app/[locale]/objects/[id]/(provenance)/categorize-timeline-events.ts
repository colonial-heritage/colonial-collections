import {LabeledProvenanceEvent} from './definitions';

interface CategorizedEvents {
  rangeEvents: LabeledProvenanceEvent[];
  singleEvents: LabeledProvenanceEvent[];
  eventsWithoutDates: LabeledProvenanceEvent[];
}

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
