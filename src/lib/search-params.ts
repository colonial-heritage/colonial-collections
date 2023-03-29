import {
  SearchOptions,
  SortBy as SortBySearchOption,
  SortOrder,
} from '@/lib/dataset-fetcher';

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
  };
  sortBy?: SortBy;
}

export function getUrlWithSearchParams({
  query,
  offset,
  filters: {licenses, publishers},
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
  query?: string;
  offset?: string;
  sortBy?: SortBy;
}

// Always return the sort values so the client knows how to sort.
interface SearchOptionsWithRequiredSort extends SearchOptions {
  sortBy: NonNullable<SearchOptions['sortBy']>;
  sortOrder: NonNullable<SearchOptions['sortOrder']>;
}

// This function translates the search params to valid search options.
// Next.js already separate the search query string into separates properties with string values.
// Always return a valid SearchOptions object, even if the search params aren't correct,
// so the application doesn't fail on invalid search params.
export function fromSearchParamsToSearchOptions({
  publishers,
  licenses,
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
    },
    sortBy: sortBySearchOption,
    sortOrder: sortOrder,
  };

  if (!options.sortBy || !options.sortOrder) {
    const defaultSortMap = sortMapping[defaultSortBy];
    options.sortBy = defaultSortMap.sortBy;
    options.sortOrder = defaultSortMap.sortOrder;
  }

  if (isNaN(options.offset)) {
    options.offset = 0;
  }

  const validOptions: SearchOptionsWithRequiredSort = options;

  // Only add a search query if provided
  if (query) {
    validOptions.query = query;
  }

  return validOptions;
}

interface sortPairProps {
  sortBy: SortBySearchOption;
  sortOrder: SortOrder;
}

export function getClientSortBy(sortPair: sortPairProps): SortBy {
  return Object.entries(sortMapping).find(
    ([, {sortBy, sortOrder}]) =>
      sortPair.sortBy === sortBy && sortPair.sortOrder === sortOrder
  )![0] as SortBy;
}
