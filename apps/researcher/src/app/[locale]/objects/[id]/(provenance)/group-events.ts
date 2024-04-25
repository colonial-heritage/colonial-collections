import {UserProvenanceEvent} from './definitions';

interface GroupByDateRangeProps {
  events: UserProvenanceEvent[];
  formatDateRange: (props: {startDate?: Date; endDate?: Date}) => string;
}

// This function groups an array of events by their date range.
// The function returns an object where each key is a string representation of a date range,
// and each value is an array of all events that fall within that date range.
export function groupByDateRange({
  events,
  formatDateRange,
}: GroupByDateRangeProps) {
  return events.reduce(
    (eventGroups: {[dateRange: string]: UserProvenanceEvent[]}, event) => {
      const dateRange = formatDateRange(event.date || {}) || '';
      if (!eventGroups[dateRange]) {
        eventGroups[dateRange] = [];
      }
      eventGroups[dateRange].push(event);
      return eventGroups;
    },
    {}
  );
}
