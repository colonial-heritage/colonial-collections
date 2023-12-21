'use client';

import {
  ButtonHTMLAttributes,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import {LabeledProvenanceEvent} from './definitions';

interface SelectedEventContextType {
  selected?: string;
  setSelected: Dispatch<SetStateAction<string | undefined>>;
}

const SelectedEventContext = createContext<SelectedEventContextType>({
  selected: undefined,
  setSelected: () => {},
});

export function SelectedEventProvider({children}: {children: ReactNode}) {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const context = {
    selected,
    setSelected,
  };
  return (
    <SelectedEventContext.Provider value={context}>
      {children}
    </SelectedEventContext.Provider>
  );
}

export function useSelectedEvent() {
  const context = useContext(SelectedEventContext);
  if (!context) {
    throw new Error(
      '`useSelectedEvent` must be used within a `SelectedEventProvider`'
    );
  }
  return context;
}

interface SelectEventButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  event: LabeledProvenanceEvent;
  children: ReactNode;
}

export function SelectEventButton({
  event,
  children,
  ...props
}: SelectEventButtonProps) {
  const {setSelected, selected} = useSelectedEvent();

  const handleClick = () => {
    if (selected === event.id) {
      setSelected(undefined);
    } else {
      setSelected(event.id);
    }
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}
