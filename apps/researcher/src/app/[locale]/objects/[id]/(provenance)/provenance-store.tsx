'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import {LabeledProvenanceEvent} from './definitions';
import {groupByDateRange} from './group-events';
import {useFormatDate} from '@/lib/date-formatter/hooks';

interface SelectedEventContextType {
  selectedEvents: string[];
  setSelectedEvents: Dispatch<SetStateAction<string[]>>;
  events: LabeledProvenanceEvent[];
  eventGroups: {[dateRange: string]: LabeledProvenanceEvent[]};
  eventGroupsFiltered: {[dateRange: string]: LabeledProvenanceEvent[]};
  showTimeline: boolean;
  showDataTable: boolean;
  setShowTimeline: Dispatch<SetStateAction<boolean>>;
  setShowDataTable: Dispatch<SetStateAction<boolean>>;
}

const SelectedEventContext = createContext<SelectedEventContextType>({
  selectedEvents: [],
  setSelectedEvents: () => {},
  events: [],
  eventGroups: {},
  eventGroupsFiltered: {},
  showTimeline: true,
  showDataTable: true,
  setShowTimeline: () => {},
  setShowDataTable: () => {},
});

export function ProvenanceProvider({
  children,
  events,
}: {
  children: ReactNode;
  events: LabeledProvenanceEvent[];
}) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showDataTable, setShowDataTable] = useState(true);
  const {formatDateRange} = useFormatDate();
  const eventGroups = useMemo(
    () => groupByDateRange({events, formatDateRange}),
    [events, formatDateRange]
  );

  const eventGroupsFiltered = useMemo(() => {
    const eventsToShow =
      selectedEvents.length > 0
        ? selectedEvents.map(id => events.find(event => event.id === id)!)
        : events;

    return groupByDateRange({events: eventsToShow, formatDateRange});
  }, [events, formatDateRange, selectedEvents]);

  const context = {
    selectedEvents,
    setSelectedEvents,
    events,
    eventGroups,
    eventGroupsFiltered,
    showTimeline,
    setShowTimeline,
    showDataTable,
    setShowDataTable,
  };
  return (
    <SelectedEventContext.Provider value={context}>
      {children}
    </SelectedEventContext.Provider>
  );
}

export function useProvenance() {
  const context = useContext(SelectedEventContext);

  if (!context) {
    throw new Error(
      '`useProvenance` must be used within a `ProvenanceProvider`'
    );
  }
  return context;
}
