import {formatDateRange} from '../format-date-range';
import {LabeledProvenanceEvent} from './definitions';

interface GroupByDateRangeProps {
  events: LabeledProvenanceEvent[];
  locale: string;
}

// This function groups an array of events by their date range.
// The function returns an object where each key is a string representation of a date range,
// and each value is an array of all events that fall within that date range.
export function groupByDateRange({events, locale}: GroupByDateRangeProps) {
  const eventGroups = events.reduce(
    (groups: {[dateRange: string]: LabeledProvenanceEvent[]}, event) => {
      const dateRange =
        formatDateRange({
          startDate: event.startDate,
          endDate: event.endDate,
          locale,
        }) || '';
      if (!groups[dateRange]) {
        groups[dateRange] = [];
      }
      groups[dateRange].push(event);
      return groups;
    },
    {}
  );

  return eventGroups;
}
