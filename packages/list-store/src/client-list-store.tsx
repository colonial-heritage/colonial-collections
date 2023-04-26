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
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      useListStore.setState({
        totalCount,
        offset,
        limit,
        query,
        sortBy,
        selectedFilters: selectedFilters ?? {},
      });
      initialized.current = true;
    } else {
      // Don't reset the values the user can edit after initializing the client store.
      // Resetting these values could override user actions like typing.
      useListStore.setState({
        totalCount,
      });
    }
  }, [limit, offset, query, selectedFilters, sortBy, totalCount]);
  return null;
}
