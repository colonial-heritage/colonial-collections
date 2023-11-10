'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './use-list-store';
import {getUrlWithSearchParams} from './search-params';

interface Props {
  baseUrl: string;
  defaultSortBy: string;
}

export function useSearchParamsUpdate({baseUrl, defaultSortBy}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const newDataNeeded = useListStore(s => s.newDataNeeded);
  const query = useListStore(s => s.query);
  const offset = useListStore(s => s.offset);
  const sortBy = useListStore(s => s.sortBy);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const transitionStarted = useListStore(s => s.transitionStarted);

  useEffect(() => {
    if (newDataNeeded && !isPending) {
      const url = getUrlWithSearchParams({
        query: query,
        offset: offset,
        sortBy: sortBy,
        filters: selectedFilters,
        baseUrl: baseUrl,
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

// Wrap the hook in an component so can be placed in a context provider
export function SearchParamsUpdater({baseUrl, defaultSortBy}: Props) {
  useSearchParamsUpdate({
    baseUrl,
    defaultSortBy,
  });

  return null;
}
