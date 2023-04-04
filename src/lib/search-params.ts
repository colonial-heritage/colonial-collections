import {
  SearchOptions,
  SortBy as SortBySearchOption,
  SortOrder,
  searchOptionsSchema,
} from '@/lib/dataset-fetcher';
import {z} from 'zod';

export enum SortBy {
  RelevanceDesc = 'relevanceDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export const defaultSortBy = SortBy.RelevanceDesc;

const sortMapping = {
  [SortBy.RelevanceDesc]: {
    sortBy: SortBySearchOption.Relevance,
    sortOrder: SortOrder.Descending,
  },
  [SortBy.NameAsc]: {
    sortBy: SortBySearchOption.Name,
    sortOrder: SortOrder.Ascending,
  },
  [SortBy.NameDesc]: {
    sortBy: SortBySearchOption.Name,
    sortOrder: SortOrder.Descending,
  },
};

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
  licenses: searchParamFilterSchema,
  publishers: searchParamFilterSchema,
  spatialCoverages: searchParamFilterSchema,
  genres: searchParamFilterSchema,
  sortBy: z
    .nativeEnum(SortBy)
    // Don't add the default sort to the search params
    .optional()
    .transform(sortBy => (sortBy === defaultSortBy ? '' : sortBy)),
});

interface ClientSearchOptions {
  query?: SearchOptions['query'];
  offset?: SearchOptions['offset'];
  licenses?: string[];
  publishers?: string[];
  genres?: string[];
  spatialCoverages?: string[];
  sortBy?: SortBy;
}

export function getUrlWithSearchParams(
  clientSearchOption: ClientSearchOptions
): string {
  const searchParams: {[key: string]: string} =
    searchParamsSchema.parse(clientSearchOption);

  // Only add relevant values to the search params. Remove all keys with a empty strings
  Object.keys(searchParams).forEach(key =>
    searchParams[key] === '' ? delete searchParams[key] : {}
  );
  const encodedSearchParams = new URLSearchParams(searchParams).toString();

  if (encodedSearchParams) {
    return '/?' + encodedSearchParams;
  } else {
    return '/' + encodedSearchParams;
  }
}

export interface SearchParams {
  publishers?: string;
  licenses?: string;
  spatialCoverages?: string;
  genres?: string;
  query?: string;
  offset?: string;
  sortBy?: SortBy;
}

// Based on https://github.com/colinhacks/zod/issues/316#issuecomment-1024793482
export function fallback<T>(value: T) {
  return z.any().transform(() => value);
}

const searchOptionsFilterSchema = z
  .string()
  .optional()
  .transform(filterValue => filterValue?.split(',').filter(id => !!id))
  .pipe(z.array(z.string()).optional().default([]));

// Always return a valid SearchOptions object, even if the search params aren't correct,
// so the application doesn't fail on invalid search params.
const searchOptionsWithFallbackSchema = searchOptionsSchema.extend({
  offset: z
    .string()
    .transform(offsetString => +offsetString)
    .pipe(searchOptionsSchema.shape.offset)
    .or(fallback(0)),
  filters: z
    .object({
      publishers: searchOptionsFilterSchema,
      licenses: searchOptionsFilterSchema,
      spatialCoverages: searchOptionsFilterSchema,
      genres: searchOptionsFilterSchema,
    })
    .optional(),
  sortBy: searchOptionsSchema.shape.sortBy.or(
    fallback(SortBySearchOption.Relevance)
  ),
  sortOrder: searchOptionsSchema.shape.sortOrder.or(
    fallback(SortOrder.Descending)
  ),
  query: z.string().optional(), // Don't default to "*"
});

// Always return the sort values so the client knows how to sort.
interface SearchOptionsWithRequiredSort extends SearchOptions {
  sortBy: NonNullable<SearchOptions['sortBy']>;
  sortOrder: NonNullable<SearchOptions['sortOrder']>;
}

// This function translates the search params to valid search options.
// Next.js already separate the search query string into separates properties with string values.
export function fromSearchParamsToSearchOptions({
  publishers,
  licenses,
  spatialCoverages,
  genres,
  query,
  offset,
  sortBy,
}: SearchParams): SearchOptionsWithRequiredSort {
  const {sortBy: sortBySearchOption, sortOrder} =
    (sortBy && sortMapping[sortBy]) || {};

  return searchOptionsWithFallbackSchema.parse({
    offset,
    filters: {
      publishers,
      licenses,
      spatialCoverages,
      genres,
    },
    sortBy: sortBySearchOption,
    sortOrder: sortOrder,
    query: query,
  });
}

interface SortPairProps {
  sortBy: SortBySearchOption;
  sortOrder: SortOrder;
}

export function getClientSortBy(sortPair: SortPairProps): SortBy {
  return Object.entries(sortMapping).find(
    ([, {sortBy, sortOrder}]) =>
      sortPair.sortBy === sortBy && sortPair.sortOrder === sortOrder
  )![0] as SortBy;
}
