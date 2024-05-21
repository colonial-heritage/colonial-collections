'use client';

import {useRouter} from '@/navigation';
import {
  getUrlWithSearchParams,
  useListStore,
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
  baseUrl: string;
  view?: string;
  imageVisibility?: string;
}

export function ListStoreUpdater({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
  baseUrl,
  view,
  imageVisibility,
}: Props) {
  const router = useRouter();

  const defaultSortBy = useListStore(s => s.defaultSortBy);
  const defaultView = useListStore(s => s.defaultView);
  const defaultImageVisibility = useListStore(s => s.defaultImageVisibility);

  useUpdateListStore({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
    view,
    imageVisibility,
  });

  useSearchParamsUpdate(router.replace);

  const url = getUrlWithSearchParams({
    query,
    offset,
    sortBy,
    filters: selectedFilters,
    defaultSortBy,
    baseUrl,
    limit,
    view,
    imageVisibility,
    defaultView,
    defaultImageVisibility,
  });

  saveLastSearch(baseUrl, url);

  return null;
}
