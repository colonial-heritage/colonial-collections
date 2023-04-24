'use client';

import {useRef, useEffect} from 'react';
import {useListStore, SortBy} from 'list-store';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  selectedFilters: {[filterKey: string]: string[] | undefined} | undefined;
}

export function ClientStore({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
}: Props) {
  const apiUpdate = useListStore(state => state.apiUpdate);
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
      apiUpdate({
        totalCount,
      });
    }
  }, [apiUpdate, limit, offset, query, selectedFilters, sortBy, totalCount]);
  return null;
}
