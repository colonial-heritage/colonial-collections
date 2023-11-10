'use client';

import {ReactNode} from 'react';
import {
  useListStore,
  getUrlWithSearchParams,
  defaultSortBy as globalDefaultSortBy,
} from '@colonial-collections/list-store';
import Link from 'next-intl/link';
import {useMemo} from 'react';

interface Props {
  children: ReactNode;
  baseUrl: string;
  className?: string;
}

export function ToFilteredListButton({children, baseUrl, className}: Props) {
  const query = useListStore(s => s.query);
  const offset = useListStore(s => s.offset);
  const sortBy = useListStore(s => s.sortBy);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const defaultSortBy =
    useListStore(s => s.defaultSortBy) || globalDefaultSortBy;

  const href = useMemo(
    () =>
      getUrlWithSearchParams({
        query,
        offset,
        sortBy,
        filters: selectedFilters,
        defaultSortBy,
        baseUrl: baseUrl,
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
