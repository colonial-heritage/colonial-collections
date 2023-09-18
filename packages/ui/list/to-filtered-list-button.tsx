'use client';

import {ReactNode} from 'react';
import {
  useListStore,
  getUrlWithSearchParams,
  defaultSortBy,
} from '@colonial-collections/list-store';
import Link from 'next-intl/link';
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
        defaultSortBy: listStore.defaultSortBy || defaultSortBy,
        baseUrl: baseUrl,
      }),
    [
      baseUrl,
      listStore.defaultSortBy,
      listStore.offset,
      listStore.query,
      listStore.selectedFilters,
      listStore.sortBy,
    ]
  );
  return (
    <Link
      data-testid="to-filtered-list-button"
      className={className}
      href={href}
    >
      {children}
    </Link>
  );
}
