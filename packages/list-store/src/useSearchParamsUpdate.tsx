'use client';

import {useRouter} from 'next-intl/client';
import {useEffect, useTransition} from 'react';
import {useListStore} from './useListStore';

export function useSearchParamsUpdate() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const state = useListStore();

  useEffect(() => {
    if (state.newDataNeeded && !isPending) {
      startTransition(() => {
        useListStore.setState({newDataNeeded: false});
        router.replace(state.composed.urlWithSearchParams);
      });
    }
  }, [
    isPending,
    router,
    state.composed.urlWithSearchParams,
    state.newDataNeeded,
  ]);

  return {isPending};
}
