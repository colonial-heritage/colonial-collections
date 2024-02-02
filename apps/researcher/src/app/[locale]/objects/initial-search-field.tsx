'use client';

import {SearchFieldWithLabel} from '@colonial-collections/ui/list';
import {useRouter} from '@/navigation';

export function InitialSearchField() {
  const router = useRouter();

  const navigateOnSearch = (query: string) => {
    if (query.length > 0) {
      const urlSearchParams = new URLSearchParams({query});
      router.replace(`/objects?${urlSearchParams}`);
    }
  };

  return <SearchFieldWithLabel onSearch={navigateOnSearch} />;
}
