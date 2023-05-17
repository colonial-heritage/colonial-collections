'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './useListStore';
import {getUrlWithSearchParams} from './search-params';

interface Props {
  baseUrl: string;
}

export function useSearchParamsUpdate({baseUrl}: Props) {
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
      });
      startTransition(() => {
        listStore.transitionStarted();
        router.replace(url);
      });
    }
  }, [isPending, router, listStore, baseUrl]);

  return {isPending};
}
