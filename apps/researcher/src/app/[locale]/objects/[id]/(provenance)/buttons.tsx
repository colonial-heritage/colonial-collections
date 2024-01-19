'use client';

import classNames from 'classnames';
import {useProvenance} from './provenance-store';
import {ButtonHTMLAttributes, ReactNode} from 'react';

interface SelectEventsButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ids: string[];
  children: ReactNode;
}

export function SelectEventsButton({ids, children}: SelectEventsButtonProps) {
  const {setSelectedEvents, selectedEvents} = useProvenance();
  const selected = ids.some((id: string) => selectedEvents.includes(id));

  const handleClick = () => {
    if (selected) {
      setSelectedEvents(selectedEvents.filter(id => !ids.includes(id)));
    } else {
      setSelectedEvents(ids);
    }
  };

  return (
    <button
      className={classNames(
        'bg-consortiumBlue-600 rounded-full h-8 min-w-[33px] px-1 flex justify-center items-center border-2 transition text-xs font-medium whitespace-nowrap',
        {
          'hover:bg-consortiumBlue-700 border-white hover:border-consortiumGreen-300 hover:text-consortiumGreen-300':
            !selected,
          'bg-consortiumBlue-700 border-consortiumGreen-300 text-consortiumGreen-300':
            selected,
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
