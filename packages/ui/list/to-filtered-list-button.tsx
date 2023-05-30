'use client';

import {ReactNode} from 'react';
import {
  useListStore,
  getUrlWithSearchParams,
} from '@colonial-collections/list-store';
import {Link} from 'next-intl';
import {useMemo} from 'react';

interface Props {
  children: ReactNode;
  baseUrl: string;
  className?: string;
}

export function ToFilteredListButton({children, baseUrl, className}: Props) {
  const listStore = useListStore();
  const href = useMemo(
    () =>
      getUrlWithSearchParams({
        query: listStore.query,
        offset: listStore.offset,
        sortBy: listStore.sortBy,
        filters: listStore.selectedFilters,
        baseUrl: baseUrl,
      }),
    [
      baseUrl,
      listStore.offset,
      listStore.query,
      listStore.selectedFilters,
      listStore.sortBy,
    ]
  );
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
