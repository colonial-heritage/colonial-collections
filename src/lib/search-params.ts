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

interface ClientSearchOptions {
  query?: SearchOptions['query'];
  offset?: SearchOptions['offset'];
  filters: {
    licenses?: string[];
    publishers?: string[];
    spatialCoverages?: string[];
  };
  sortBy?: SortBy;
}

export function getUrlWithSearchParams({
  query,
  offset,
  filters: {licenses, publishers, spatialCoverages},
  sortBy,
}: ClientSearchOptions): string {
  const searchParams: {[key: string]: string} = {};

  if (query) {
    searchParams.query = query;
  }

  if (licenses?.length) {
    searchParams.licenses = licenses.join(',');
  }

  if (publishers?.length) {
    searchParams.publishers = publishers.join(',');
  }

  if (spatialCoverages?.length) {
    searchParams.spatialCoverages = spatialCoverages.join(',');
  }

  if (offset) {
    searchParams.offset = `${offset}`;
  }

  if (sortBy && sortBy !== defaultSortBy) {
    searchParams.sortBy = sortBy;
  }

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

// Always return a valid SearchOptions object, even if the search params aren't correct,
// so the application doesn't fail on invalid search params.
const searchOptionsWithFallbackSchema = searchOptionsSchema.extend({
  offset: searchOptionsSchema.shape.offset.or(fallback(0)),
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
  offset = '0',
  sortBy = defaultSortBy,
}: SearchParams): SearchOptionsWithRequiredSort {
  const {sortBy: sortBySearchOption, sortOrder} = sortMapping[sortBy] || {};

  // Transform the string values from the search params to SearchOptions
  const options = {
    offset: +offset,
    filters: {
      publishers: publishers?.split(',').filter(id => !!id),
      licenses: licenses?.split(',').filter(id => !!id),
      spatialCoverages: spatialCoverages?.split(',').filter(id => !!id),
      genres: genres?.split(',').filter(id => !!id),
    },
    sortBy: sortBySearchOption,
    sortOrder: sortOrder,
    query: query,
  };

  const validOptions: SearchOptionsWithRequiredSort =
    searchOptionsWithFallbackSchema.parse(options);

  return validOptions;
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
