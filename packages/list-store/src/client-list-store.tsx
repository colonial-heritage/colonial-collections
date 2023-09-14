'use client';

import {useEffect} from 'react';
import {useListStore} from './useListStore';
import {useSearchParamsUpdate} from './useSearchParamsUpdate';
import {defaultSortBy as packageDefaultSortBy} from './sort';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  selectedFilters?: {[filterKey: string]: string[] | undefined};
  baseUrl: string;
  defaultSortBy?: string;
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
  baseUrl,
  defaultSortBy = packageDefaultSortBy,
}: Props) {
  const listStore = useListStore();

  useEffect(() => {
    listStore.setNewData({
      totalCount,
      offset,
      limit,
      query,
      sortBy: sortBy ?? defaultSortBy,
      selectedFilters: selectedFilters ?? {},
    });
  }, [
    limit,
    offset,
    query,
    selectedFilters,
    sortBy,
    listStore,
    totalCount,
    defaultSortBy,
  ]);

  useSearchParamsUpdate({baseUrl, defaultSortBy});

  return null;
}
