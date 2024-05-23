'use client';

import {useEffect, useMemo, useTransition} from 'react';
import {useListStore} from './use-list-store';
import {getUrlWithSearchParams} from './search-params';
import {ImageFetchMode, ListView} from './definitions';

interface Props<SortBy> {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: SortBy;
  selectedFilters?: {
    [filterKey: string]: (string | number)[] | number | string | undefined;
  };
  view?: ListView;
  imageFetchMode?: ImageFetchMode;
  routerReplace: (url: string, options?: {scroll?: boolean}) => void;
}

export const useListHref = () => {
  const query = useListStore(s => s.query);
  const offset = useListStore(s => s.offset);
  const sortBy = useListStore(s => s.sortBy);
  const baseUrl = useListStore(s => s.baseUrl);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const defaultSortBy = useListStore(s => s.defaultSortBy);
  const defaultView = useListStore(s => s.defaultView);
  const defaultImageFetchMode = useListStore(s => s.defaultImageFetchMode);
  const view = useListStore(s => s.view);
  const imageFetchMode = useListStore(s => s.imageFetchMode);
  const limit = useListStore(s => s.limit);

  const href = useMemo(
    () =>
      getUrlWithSearchParams({
        query,
        offset,
        sortBy,
        filters: selectedFilters,
        defaultSortBy,
        defaultView,
        defaultImageFetchMode,
        baseUrl,
        view,
        imageFetchMode,
        limit,
      }),
    [
      baseUrl,
      defaultImageFetchMode,
      defaultSortBy,
      defaultView,
      imageFetchMode,
      limit,
      offset,
      query,
      selectedFilters,
      sortBy,
      view,
    ]
  );

  return href;
};

export function useSearchParamsUpdate<SortBy>(
  routerReplace: Props<SortBy>['routerReplace']
) {
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

export function useUpdateListStore<SortBy>({
  totalCount,
  offset,
  limit,
  view,
  imageFetchMode,
  query,
  sortBy,
  selectedFilters,
}: Omit<Props<SortBy>, 'routerReplace'>) {
  const setNewData = useListStore(s => s.setNewData);

  useEffect(() => {
    setNewData({
      totalCount,
      offset,
      limit,
      view,
      imageFetchMode,
      query,
      sortBy,
      selectedFilters: selectedFilters ?? {},
    });
  }, [
    imageFetchMode,
    limit,
    offset,
    query,
    selectedFilters,
    setNewData,
    sortBy,
    totalCount,
    view,
  ]);
}
