import {z} from 'zod';
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
}

export function getUrlWithSearchParams({
  query,
  offset,
  sortBy,
  filters,
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
