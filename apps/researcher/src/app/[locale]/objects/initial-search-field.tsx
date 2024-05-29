'use client';

import {SearchFieldWithLabel} from '@colonial-collections/ui/list';
import {useRouter} from '@/navigation';
import {
  defaultImageFetchMode,
  useListStore,
} from '@colonial-collections/list-store';

export function InitialSearchField() {
  const router = useRouter();
  const imageFetchMode = useListStore(s => s.imageFetchMode);

  const navigateOnSearch = (query: string) => {
    if (query.length > 0) {
      const searchParams: {query: string; imageFetchMode?: string} = {query};

      if (imageFetchMode !== defaultImageFetchMode) {
        searchParams.imageFetchMode = imageFetchMode;
      }

      const urlSearchParams = new URLSearchParams(searchParams);
      router.replace(`/objects?${urlSearchParams}`);
    }
  };

  return <SearchFieldWithLabel onSearch={navigateOnSearch} />;
}
