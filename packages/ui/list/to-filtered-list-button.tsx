'use client';

import {ReactNode} from 'react';
import {
  useListStore,
  getUrlWithSearchParams,
} from '@colonial-collections/list-store';
import Link from 'next-intl/link';
import {useMemo} from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function ToFilteredListButton({children, className}: Props) {
  const query = useListStore(s => s.query);
  const offset = useListStore(s => s.offset);
  const sortBy = useListStore(s => s.sortBy);
  const baseUrl = useListStore(s => s.baseUrl);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const defaultSortBy = useListStore(s => s.defaultSortBy);

  const href = useMemo(
    () =>
      getUrlWithSearchParams({
        query,
        offset,
        sortBy,
        filters: selectedFilters,
        defaultSortBy,
        baseUrl,
      }),
    [baseUrl, defaultSortBy, offset, query, selectedFilters, sortBy]
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
