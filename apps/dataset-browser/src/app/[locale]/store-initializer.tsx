'use client';

import {useRef} from 'react';
import {useListStore, SortBy} from 'list-store';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  selectedFilters: {[filterKey: string]: string[] | undefined} | undefined;
}

export function StoreInitializer({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
}: Props) {
  const initialized = useRef(false);
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
  }
  return null;
}
