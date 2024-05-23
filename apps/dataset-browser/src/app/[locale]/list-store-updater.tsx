'use client';

import {useRouter} from '@/navigation';
import {
  useSearchParamsUpdate,
  useUpdateListStore,
} from '@colonial-collections/list-store';

interface Props<SortBy> {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: SortBy;
  selectedFilters?: {[filterKey: string]: string[] | undefined};
}

export function ListStoreUpdater<SortBy>(updateProps: Props<SortBy>) {
  const router = useRouter();
  useUpdateListStore(updateProps);
  useSearchParamsUpdate(router.replace);

  return null;
}
