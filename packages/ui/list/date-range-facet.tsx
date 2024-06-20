'use client';

import {useListStore} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';
import {FacetTitle, FacetWrapper} from './base-facet';

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
  const selectedFilters = useListStore(s => s.selectedFilters);
  const filterChange = useListStore(s => s.filterChange);
  const startDate = selectedFilters[startDateKey];
  const endDate = selectedFilters[endDateKey];

  const t = useTranslations('Filters');

  return (
    <FacetWrapper testId={testId} title={title}>
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between">
        <FacetTitle />
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
              className="text-consortium-blue-800 w-24 border rounded-md grow border-gray-300 px-4 py-1 sm:text-sm"
              onChange={e => {
                filterChange(
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
              className="text-consortium-blue-800 w-24 border rounded-md grow border-gray-300 px-4 py-1 sm:text-sm"
              onChange={e => {
                filterChange(
                  endDateKey,
                  e.target.value ? (+e.target.value as number) : undefined
                );
              }}
              value={typeof endDate === 'number' ? endDate : ''}
            />
          </div>
        </div>
      </div>
    </FacetWrapper>
  );
}
