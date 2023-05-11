import {
  SearchOptions,
  SortBy as SortBySearchOption,
  SortOrder,
  searchOptionsSchema,
} from '@/lib/datasets';
import {z} from 'zod';
import {SortBy} from '@colonial-collections/list-store';

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
function fallback<T>(value: T) {
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
// Next.js already separates the search query string into separate properties with string values.
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
