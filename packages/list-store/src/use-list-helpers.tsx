'use client';

import {useEffect, useMemo, useTransition} from 'react';
import {useListStore} from './use-list-store';
import {getUrlWithSearchParams} from './search-params';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  selectedFilters?: {
    [filterKey: string]: (string | number)[] | number | string | undefined;
  };
  routerReplace: (url: string, options?: {scroll?: boolean}) => void;
}

export const useListHref = () => {
  const query = useListStore(s => s.query);
  const offset = useListStore(s => s.offset);
  const sortBy = useListStore(s => s.sortBy);
  const baseUrl = useListStore(s => s.baseUrl);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const defaultSortBy = useListStore(s => s.defaultSortBy);

  const href = useMemo(
    () =>
      getUrlWithSearchParams({
        query,
        offset,
        sortBy,
        filters: selectedFilters,
        defaultSortBy,
        baseUrl,
      }),
    [baseUrl, defaultSortBy, offset, query, selectedFilters, sortBy]
  );

  return href;
};

export function useSearchParamsUpdate(routerReplace: Props['routerReplace']) {
  const [isPending, startTransition] = useTransition();
  const href = useListHref();

  const newDataNeeded = useListStore(s => s.newDataNeeded);
  const transitionStarted = useListStore(s => s.transitionStarted);

  useEffect(() => {
    if (newDataNeeded && !isPending) {
      startTransition(() => {
        transitionStarted();
        routerReplace(href, {scroll: false});
      });
    }
  }, [href, isPending, newDataNeeded, routerReplace, transitionStarted]);
}

export const useUpdateListStore = ({
  totalCount,
  offset,
  limit,
  query,
  sortBy,
  selectedFilters,
}: Omit<Props, 'routerReplace'>) => {
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
