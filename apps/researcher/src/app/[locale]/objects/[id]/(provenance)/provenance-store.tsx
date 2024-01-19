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
  selectedEvents: string[];
  setSelectedEvents: Dispatch<SetStateAction<string[]>>;
  events: LabeledProvenanceEvent[];
  showTimeline: boolean;
  showDataTable: boolean;
  setShowTimeline: Dispatch<SetStateAction<boolean>>;
  setShowDataTable: Dispatch<SetStateAction<boolean>>;
}

const SelectedEventContext = createContext<SelectedEventContextType>({
  selectedEvents: [],
  setSelectedEvents: () => {},
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
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showDataTable, setShowDataTable] = useState(true);

  const context = {
    selectedEvents,
    setSelectedEvents,
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
