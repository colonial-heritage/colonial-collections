'use client';

import {useCallback, useMemo, ReactNode} from 'react';
import {useListStore} from '@colonial-collections/list-store';

interface FacetWrapperProps {
  children: ReactNode;
  testId?: string;
}

export function FacetWrapper({children, testId}: FacetWrapperProps) {
  return (
    <div className="w-full max-w-[450px]" data-testid={testId}>
      {children}
    </div>
  );
}

export function FacetTitle({title}: {title: string}) {
  return (
    <div className="font-semibold grow">
      <span>{title}</span>
    </div>
  );
}

interface FacetCheckBoxProps {
  name: string | number | undefined;
  id: string | number;
  count: number;
  filterKey: string;
}

export function FacetCheckBox({
  name,
  id,
  count,
  filterKey,
}: FacetCheckBoxProps) {
  const selectedFilters = useListStore(s => s.selectedFilters);
  const filterChange = useListStore(s => s.filterChange);

  const selectedFiltersForKey = useMemo(
    () => selectedFilters[filterKey] || [],
    [filterKey, selectedFilters]
  ) as (string | number)[];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        filterChange(filterKey, [...selectedFiltersForKey, e.target.value]);
      } else {
        filterChange(
          filterKey,
          selectedFiltersForKey.filter(filterId => e.target.value !== filterId)
        );
      }
    },
    [filterChange, filterKey, selectedFiltersForKey]
  );

  return (
    <div className="flex flex-row justify-between gap-2 w-full mb-2 items-center">
      <div className="flex flex-row">
        <input
          className=" w-5 h-5 mr-2 rounded border-gray-300 text-rpBrand1-700 focus:ring-rpBrand1-700"
          type="checkbox"
          id={`facet-${id}`}
          name={`facet-${id}`}
          value={id}
          checked={selectedFiltersForKey.some(filterId => id === filterId)}
          onChange={handleChange}
        />
        <label className="truncate max-w-[230px]" htmlFor={`facet-${id}`}>
          {name}
        </label>
      </div>
      <div className="text-sm text-neutral-500">{count}</div>
    </div>
  );
}
