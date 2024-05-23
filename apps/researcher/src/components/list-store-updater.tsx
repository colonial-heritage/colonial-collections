'use client';

import {useRouter} from '@/navigation';
import {
  ImageFetchMode,
  ListView,
  getUrlWithSearchParams,
  useListStore,
  useSearchParamsUpdate,
  useUpdateListStore,
} from '@colonial-collections/list-store';
import {saveLastSearch} from '@/lib/last-search';

interface Props<SortBy> {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: SortBy;
  selectedFilters?: {
    [filterKey: string]: (string | number)[] | number | string | undefined;
  };
  baseUrl: string;
  view?: ListView;
  imageFetchMode?: ImageFetchMode;
}

export function ListStoreUpdater<SortBy>({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
  baseUrl,
  view,
  imageFetchMode,
}: Props<SortBy>) {
  const router = useRouter();

  const defaultSortBy = useListStore<SortBy, SortBy>(s => s.defaultSortBy);
  const defaultView = useListStore(s => s.defaultView);
  const defaultImageFetchMode = useListStore(s => s.defaultImageFetchMode);

  useUpdateListStore({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
    view,
    imageFetchMode,
  });

  useSearchParamsUpdate(router.replace);

  const url = getUrlWithSearchParams<SortBy>({
    query,
    offset,
    sortBy,
    filters: selectedFilters,
    defaultSortBy,
    baseUrl,
    limit,
    view,
    imageFetchMode,
    defaultView,
    defaultImageFetchMode,
  });

  saveLastSearch(baseUrl, url);

  return null;
}
