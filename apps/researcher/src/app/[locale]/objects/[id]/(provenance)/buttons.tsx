'use client';

import classNames from 'classnames';
import {useProvenance} from './provenance-store';
import {ButtonHTMLAttributes, ReactNode} from 'react';

interface SelectEventButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  children: ReactNode;
}

export function SelectEventButton({id, children}: SelectEventButtonProps) {
  const {setSelectedEvent, selectedEvent} = useProvenance();

  const handleClick = () => {
    if (selectedEvent === id) {
      setSelectedEvent(undefined);
    } else {
      setSelectedEvent(id);
    }
  };

  return (
    <button
      className={classNames(
        'bg-consortiumBlue-600 rounded-full h-8 w-8 min-w-8 flex justify-center items-center border-2 transition text-xs font-medium',
        {
          'hover:bg-consortiumBlue-700 border-white hover:border-consortiumGreen-300 hover:text-consortiumGreen-300':
            selectedEvent !== id,
          'bg-consortiumBlue-700 border-consortiumGreen-300 text-consortiumGreen-300':
            selectedEvent === id,
        }
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export function ToggleViewButtons() {
  const {showTimeline, showDataTable, setShowTimeline, setShowDataTable} =
    useProvenance();

  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  const toggleDataTable = () => {
    setShowDataTable(!showDataTable);
  };

  return (
    <>
      <button
        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
        onClick={toggleTimeline}
      >
        {showTimeline ? 'Hide timeline' : 'Show timeline'}
      </button>
      <button
        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
        onClick={toggleDataTable}
      >
        {showDataTable ? 'Hide data table' : 'Show data table'}
      </button>
    </>
  );
}
