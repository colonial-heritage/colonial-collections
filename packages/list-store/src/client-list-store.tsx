'use client';

import {useRef, useEffect} from 'react';
import {useListStore} from './useListStore';
import {SortBy} from './sort';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  selectedFilters: {[filterKey: string]: string[] | undefined} | undefined;
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
  const state = useListStore();
  useEffect(() => {
    state.newServerData({
      totalCount,
      offset,
      limit,
      query,
      sortBy,
      selectedFilters: selectedFilters ?? {},
    });
  }, [limit, offset, query, selectedFilters, sortBy, state, totalCount]);
  return null;
}
