'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './useListStore';
import {getUrlWithSearchParams} from './search-params';

export function useSearchParamsUpdate() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const state = useListStore();

  useEffect(() => {
    if (state.newDataNeeded && !isPending) {
      const url = getUrlWithSearchParams({
        query: state.query,
        offset: state.offset,
        sortBy: state.sortBy,
        filters: state.selectedFilters,
      });
      startTransition(() => {
        useListStore.setState({newDataNeeded: false});
        router.replace(url);
      });
    }
  }, [isPending, router, state]);

  return {isPending};
}
