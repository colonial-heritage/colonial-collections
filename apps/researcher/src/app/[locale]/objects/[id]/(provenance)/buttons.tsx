'use client';

import classNames from 'classnames';
import {useProvenance} from './provenance-store';
import {ButtonHTMLAttributes, MouseEvent, ReactNode} from 'react';
import {useTranslations} from 'next-intl';

interface SelectEventsButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ids: string[];
  children: ReactNode;
}

export function SelectEventsButton({ids, children}: SelectEventsButtonProps) {
  const {setSelectedEvents, selectedEvents} = useProvenance();
  const selected = ids.some((id: string) => selectedEvents.includes(id));

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (selected) {
      setSelectedEvents(selectedEvents.filter(id => !ids.includes(id)));
    } else {
      setSelectedEvents(ids);
    }
    event.stopPropagation();
  };

  return (
    <button
      className={classNames(
        'rounded-full h-8 min-w-[33px] px-1 flex justify-center items-center border-2 transition text-xs whitespace-nowrap',
        {
          'border-consortiumBlue-200 bg-white hover:bg-consortiumBlue-200 hover:border-consortiumBlue-200 hover:text-white':
            !selected,
          'border-consortiumBlue-200 bg-consortiumBlue-200 text-white':
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
  const t = useTranslations('Provenance');
  const {showTimeline, showDataTable, setShowTimeline, setShowDataTable} =
    useProvenance();

  const toggleTimeline = () => setShowTimeline(!showTimeline);
  const toggleDataTable = () => setShowDataTable(!showDataTable);

  return (
    <>
      <button
        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumBlue-100 hover:bg-consortiumBlue-50 text-neutral-900 transition flex items-center gap-1"
        onClick={toggleTimeline}
      >
        {showTimeline ? t('hideTimelineButton') : t('showTimelineButton')}
      </button>
      <button
        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumBlue-100 hover:bg-consortiumBlue-50 text-neutral-900 transition flex items-center gap-1"
        onClick={toggleDataTable}
      >
        {showDataTable ? t('hideDataTableButton') : t('showDataTableButton')}
      </button>
    </>
  );
}
