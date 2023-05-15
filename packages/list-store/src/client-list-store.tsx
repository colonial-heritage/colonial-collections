'use client';

import {useEffect} from 'react';
import {useListStore} from './useListStore';
import {SortBy} from './sort';
import {useSearchParamsUpdate} from './useSearchParamsUpdate';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  selectedFilters?: {[filterKey: string]: string[] | undefined};
}

// The server component that does the API call loads this component.
// Therefore, every API call will rerender this component and trigger a client store update.
export function ClientListStore({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
}: Props) {
  const listStore = useListStore();

  useEffect(() => {
    listStore.setNewData({
      totalCount,
      offset,
      limit,
      query,
      sortBy,
      selectedFilters: selectedFilters ?? {},
    });
  }, [limit, offset, query, selectedFilters, sortBy, listStore, totalCount]);

  useSearchParamsUpdate();

  return null;
}
