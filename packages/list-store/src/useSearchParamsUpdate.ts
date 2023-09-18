'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './useListStore';
import {getUrlWithSearchParams} from './search-params';

interface Props {
  baseUrl: string;
  defaultSortBy: string;
}

export function useSearchParamsUpdate({baseUrl, defaultSortBy}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const listStore = useListStore();

  useEffect(() => {
    if (listStore.newDataNeeded && !isPending) {
      const url = getUrlWithSearchParams({
        query: listStore.query,
        offset: listStore.offset,
        sortBy: listStore.sortBy,
        filters: listStore.selectedFilters,
        baseUrl: baseUrl,
        defaultSortBy,
      });
      startTransition(() => {
        listStore.transitionStarted();
        router.replace(url);
      });
    }
  }, [isPending, router, listStore, baseUrl, defaultSortBy]);

  return {isPending};
}
