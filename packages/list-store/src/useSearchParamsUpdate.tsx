'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './useListStore';
import {getUrlWithSearchParams} from './search-params';

export function useSearchParamsUpdate() {
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
      });
      startTransition(() => {
        useListStore.setState({newDataNeeded: false});
        router.replace(url);
      });
    }
  }, [isPending, router, listStore]);

  return {isPending};
}
