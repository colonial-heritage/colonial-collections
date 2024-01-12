'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import {LabeledProvenanceEvent} from './definitions';

interface SelectedEventContextType {
  selectedEvent?: string;
  setSelectedEvent: Dispatch<SetStateAction<string | undefined>>;
  events: LabeledProvenanceEvent[];
  showTimeline: boolean;
  showDataTable: boolean;
  setShowTimeline: Dispatch<SetStateAction<boolean>>;
  setShowDataTable: Dispatch<SetStateAction<boolean>>;
}

const SelectedEventContext = createContext<SelectedEventContextType>({
  selectedEvent: undefined,
  setSelectedEvent: () => {},
  events: [],
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
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(
    undefined
  );
  const [showTimeline, setShowTimeline] = useState(true);
  const [showDataTable, setShowDataTable] = useState(true);

  const context = {
    selectedEvent,
    setSelectedEvent,
    events,
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
