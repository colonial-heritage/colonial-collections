'use client';

import {useListStore} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';

interface DateRangeFacetProps {
  startDateKey: string;
  endDateKey: string;
  title: string;
  testId?: string;
}

export function DateRangeFacet({
  startDateKey,
  endDateKey,
  title,
  testId,
}: DateRangeFacetProps) {
  const listStore = useListStore();
  const startDate = listStore.selectedFilters[startDateKey];
  const endDate = listStore.selectedFilters[endDateKey];

  const t = useTranslations('Filters');

  return (
    <div
      className="flex flex-col w-full max-w-[450px] mt-6"
      data-testid={testId}
    >
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between">
        <legend className="block font-semibold text-gray-900 w-full">
          {title}
        </legend>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 lg:justify-between">
        <div className="flex justify-between lg:flex-col">
          <label htmlFor={startDateKey} className="font-semibold">
            {t('fromYear')}
          </label>
          <div className="">
            <input
              type="number"
              id={startDateKey}
              name={startDateKey}
              className="w-24 border rounded-md grow border-gray-300 px-4 py-1 sm:text-sm"
              onChange={e => {
                listStore.filterChange(
                  startDateKey,
                  e.target.value ? (+e.target.value as number) : undefined
                );
              }}
              value={typeof startDate === 'number' ? startDate : ''}
            />
          </div>
        </div>
        <div className="flex justify-between lg:flex-col">
          <label htmlFor={endDateKey} className="font-semibold">
            {t('tillYear')}
          </label>
          <div className="">
            <input
              type="number"
              id={endDateKey}
              name={endDateKey}
              className="w-24 border rounded-md grow border-gray-300 px-4 py-1 sm:text-sm"
              onChange={e => {
                listStore.filterChange(
                  endDateKey,
                  e.target.value ? (+e.target.value as number) : undefined
                );
              }}
              value={typeof endDate === 'number' ? endDate : ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
