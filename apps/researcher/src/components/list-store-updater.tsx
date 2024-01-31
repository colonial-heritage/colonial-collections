'use client';

import {useRouter} from '@/navigation';
import {
  getUrlWithSearchParams,
  useSearchParamsUpdate,
  useUpdateListStore,
} from '@colonial-collections/list-store';
import {saveLastSearch} from '@/lib/last-search';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  selectedFilters?: {
    [filterKey: string]: (string | number)[] | number | string | undefined;
  };
  defaultSortBy: string;
  baseUrl: string;
}

export function ListStoreUpdater({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
  defaultSortBy,
  baseUrl,
}: Props) {
  const router = useRouter();
  useUpdateListStore({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
  });
  useSearchParamsUpdate(router.replace);
  const url = getUrlWithSearchParams({
    query,
    offset,
    sortBy,
    filters: selectedFilters,
    defaultSortBy,
    baseUrl,
  });
  saveLastSearch(baseUrl, url);

  return null;
}
