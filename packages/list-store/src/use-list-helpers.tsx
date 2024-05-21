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
  view?: string;
  imageVisibility?: string;
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
  const defaultImageVisibility = useListStore(s => s.defaultImageVisibility);
  const view = useListStore(s => s.view);
  const imageVisibility = useListStore(s => s.imageVisibility);
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
        defaultImageVisibility,
        baseUrl,
        view,
        imageVisibility,
        limit,
      }),
    [
      baseUrl,
      defaultImageVisibility,
      defaultSortBy,
      defaultView,
      imageVisibility,
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
  view,
  imageVisibility,
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
      view,
      imageVisibility,
      query,
      sortBy,
      selectedFilters: selectedFilters ?? {},
    });
  }, [
    imageVisibility,
    limit,
    offset,
    query,
    selectedFilters,
    setNewData,
    sortBy,
    totalCount,
    view,
  ]);
};
