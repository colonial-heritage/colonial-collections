import {z, Schema} from 'zod';
import {SortBy, defaultSortBy} from './sort';

const searchParamFilterSchema = z
  .array(z.string())
  .default([])
  .transform(filterValues => filterValues.join(','));

const searchParamsSchema = z.object({
  query: z.string().default(''),
  offset: z
    .number()
    .default(0)
    // Don't add the default offset of 0 to the search params
    .transform(offset => (offset > 0 ? `${offset}` : '')),
  sortBy: z
    .nativeEnum(SortBy)
    .default(defaultSortBy)
    // Don't add the default sort to the search params
    .transform(sortBy => (sortBy === defaultSortBy ? '' : sortBy)),
});

interface ClientSearchOptions {
  query?: string;
  offset?: number;
  sortBy?: SortBy;
  filters?: {[filterKey: string]: string[] | undefined};
  baseUrl: string;
}

export function getUrlWithSearchParams({
  query,
  offset,
  sortBy,
  filters,
  baseUrl,
}: ClientSearchOptions): string {
  const searchParams: {[key: string]: string} = searchParamsSchema.parse({
    query,
    offset,
    sortBy,
  });

  if (filters) {
    Object.keys(filters).forEach(filterKey => {
      searchParams[filterKey] = searchParamFilterSchema.parse(
        filters[filterKey]
      );
    });
  }

  // Only add relevant values to the search params. Remove all keys with empty strings as values
  Object.keys(searchParams).forEach(key =>
    searchParams[key] === '' ? delete searchParams[key] : {}
  );
  const encodedSearchParams = new URLSearchParams(searchParams).toString();

  if (encodedSearchParams) {
    return baseUrl + '?' + encodedSearchParams;
  } else {
    return baseUrl + encodedSearchParams;
  }
}

interface FromSearchParamsToSearchOptionsProps {
  searchParams: {
    [filter: string]: string;
  };
  options: {
    SortByEnum: Schema;
    SortOrderEnum: Schema;
    defaultSortBy: string;
    defaultSortOrder: string;
    sortMapping: {
      [sortBy: string]: {
        sortBy: string;
        sortOrder: string;
      };
    };
  };
}

// Based on https://github.com/colinhacks/zod/issues/316#issuecomment-1024793482
function fallback<T>(value: T) {
  return z.any().transform(() => value);
}

const searchOptionsFilterSchema = z
  .string()
  .optional()
  .transform(filterValue => filterValue?.split(',').filter(id => !!id))
  .pipe(z.array(z.string()).optional().default([]));

// This function translates the search params to valid search options.
// Next.js already separates the search query string into separate properties with string values.
export function fromSearchParamsToSearchOptions({
  searchParams: {query, offset, sortBy, ...filters},
  options: {
    SortByEnum,
    SortOrderEnum,
    defaultSortBy,
    defaultSortOrder,
    sortMapping,
  },
}: FromSearchParamsToSearchOptionsProps) {
  // Always return a valid SearchOptions object, even if the search params aren't correct,
  // so the application doesn't fail on invalid search params.
  const searchOptionsWithFallbackSchema = z.object({
    offset: z
      .string()
      .transform(offsetString => +offsetString)
      .pipe(z.number().int().positive())
      .or(fallback(0)),
    limit: z
      .string()
      .transform(limitString => +limitString)
      .pipe(z.number().int().positive())
      .or(fallback(10)),
    filters: z.record(searchOptionsFilterSchema).optional(),
    sortBy: SortByEnum.or(fallback(defaultSortBy)),
    sortOrder: SortOrderEnum.or(fallback(defaultSortOrder)),
    query: z.string().optional(),
  });

  const {sortBy: sortBySearchOption, sortOrder} =
    ((sortBy as SortBy) && sortMapping[sortBy as SortBy]) || {};

  const searchOptions = searchOptionsWithFallbackSchema.parse({
    offset,
    filters,
    sortBy: sortBySearchOption,
    sortOrder: sortOrder,
    query: query,
  });

  return searchOptions;
}

interface SortPairProps<SortBySearchOption, SortOrder> {
  sortPair: {sortBy: SortBySearchOption; sortOrder: SortOrder};
  sortMapping: {
    [sortBy: string]: {
      sortBy: SortBySearchOption;
      sortOrder: SortOrder;
    };
  };
}

export function getClientSortBy<SortBySearchOption, SortOrder>({
  sortPair,
  sortMapping,
}: SortPairProps<SortBySearchOption, SortOrder>): SortBy {
  return Object.entries(sortMapping).find(
    ([, {sortBy, sortOrder}]) =>
      sortPair.sortBy === sortBy && sortPair.sortOrder === sortOrder
  )![0] as SortBy;
}
