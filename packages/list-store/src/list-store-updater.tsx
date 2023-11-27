'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './use-list-store';
import {getUrlWithSearchParams} from './search-params';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  selectedFilters?: {
    [filterKey: string]: string[] | string | number | undefined;
  };
}

export function useSearchParamsUpdate() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const newDataNeeded = useListStore(s => s.newDataNeeded);
  const query = useListStore(s => s.query);
  const offset = useListStore(s => s.offset);
  const sortBy = useListStore(s => s.sortBy);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const transitionStarted = useListStore(s => s.transitionStarted);
  const defaultSortBy = useListStore(s => s.defaultSortBy);
  const baseUrl = useListStore(s => s.baseUrl);

  useEffect(() => {
    if (newDataNeeded && !isPending) {
      const url = getUrlWithSearchParams({
        query,
        offset,
        sortBy,
        filters: selectedFilters,
        baseUrl,
        defaultSortBy,
      });
      startTransition(() => {
        transitionStarted();
        router.replace(url, {scroll: false});
      });
    }
  }, [
    isPending,
    router,
    baseUrl,
    defaultSortBy,
    newDataNeeded,
    query,
    offset,
    sortBy,
    selectedFilters,
    transitionStarted,
  ]);
}

const useUpdateListStore = ({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
}: Props) => {
  const setNewData = useListStore(s => s.setNewData);

  useEffect(() => {
    setNewData({
      totalCount,
      offset,
      limit,
      query,
      sortBy,
      selectedFilters: selectedFilters ?? {},
    });
  }, [limit, offset, query, selectedFilters, setNewData, sortBy, totalCount]);
};

export function ListStoreUpdater({...updateProps}: Props) {
  useUpdateListStore(updateProps);
  useSearchParamsUpdate();

  return null;
}
