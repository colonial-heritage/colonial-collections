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
  const listStore = useListStore();

  const selectedFilters = useMemo(
    () => listStore.selectedFilters[filterKey] || [],
    [filterKey, listStore.selectedFilters]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        listStore.filterChange(filterKey, [...selectedFilters, e.target.value]);
      } else {
        listStore.filterChange(
          filterKey,
          selectedFilters.filter(filterId => e.target.value !== filterId)
        );
      }
    },
    [filterKey, listStore, selectedFilters]
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
          checked={selectedFilters.some(filterId => id === filterId)}
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
