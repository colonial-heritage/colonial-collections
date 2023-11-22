'use client';

import {useRouter} from '@/navigation';
import {
  useSearchParamsUpdate,
  useUpdateListStore,
} from '@colonial-collections/list-store';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  selectedFilters?: {[filterKey: string]: string[] | undefined};
}

export function ListStoreUpdater(updateProps: Props) {
  const router = useRouter();
  useUpdateListStore(updateProps);
  useSearchParamsUpdate(router.replace);

  return null;
}
