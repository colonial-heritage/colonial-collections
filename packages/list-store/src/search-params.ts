import {z, Schema} from 'zod';
import {SortBy} from './sort';

export type Type = 'string' | 'array' | 'number';

// Only strings are allowed in the search params.
const searchParamFilterSchema = z
  .array(z.string())
  .or(z.array(z.number().transform(value => `${value}`)))
  .or(z.string())
  .or(z.number().transform(value => `${value}`))
  .default('');

function getSearchParamsSchema(defaultSortBy: string) {
  return z.object({
    query: z.string().default(''),
    offset: z
      .number()
      .default(0)
      // Don't add the default offset of 0 to the search params.
      .transform(offset => (offset > 0 ? `${offset}` : '')),
    sortBy: z
      .string()
      .default(defaultSortBy)
      // Don't add the default sort to the search params.
      .transform(sortBy => (sortBy === defaultSortBy ? '' : sortBy)),
  });
}

interface ClientSearchOptions {
  query?: string;
  offset?: number;
  sortBy?: string;
  filters?: {
    [filterKey: string]: (string | number)[] | string | number | undefined;
  };
  baseUrl?: string;
  defaultSortBy: string;
}

export function getUrlWithSearchParams({
  query,
  offset,
  sortBy,
  filters,
  defaultSortBy,
  baseUrl = '/',
}: ClientSearchOptions): string {
  const searchParams: {[key: string]: string | string[]} =
    getSearchParamsSchema(defaultSortBy).parse({
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

  const urlSearchParams = new URLSearchParams();

  // Append the search params one by one to the URLSearchParams object. So the same key can be added multiple times.
  Object.entries(searchParams).forEach(([filterKey, filterValue]) => {
    if (Array.isArray(filterValue)) {
      filterValue.forEach(singleValue => {
        if (singleValue !== '') {
          // This will result in a query string like: '?key=value1&key=value2'.
          urlSearchParams.append(filterKey, singleValue);
        }
      });
    } else if (typeof filterValue === 'string' && filterValue !== '') {
      urlSearchParams.append(filterKey, filterValue);
    }
  });

  const encodedSearchParams = urlSearchParams.toString();

  if (encodedSearchParams) {
    return baseUrl + '?' + encodedSearchParams;
  } else {
    return baseUrl + encodedSearchParams;
  }
}

// Based on https://github.com/colinhacks/zod/issues/316#issuecomment-1024793482
function fallback<T>(value: T) {
  return z.any().transform(() => value);
}

export interface FromSearchParamsToSearchOptionsProps {
  // `searchParams` is a key-value object based on the URLs search params.
  searchParams: {
    [filter: string]: string | string[];
  };
  // The searchOption `sortBy` and `sortOrder` are enums values.
  // Set the correct enums, default values and sortMapper in the `sortOptions`.
  sortOptions: {
    // `SortByEnum` should be a Zod `nativeEnum`.
    SortByEnum: Schema;
    // `SortByEnum` should be a Zod `nativeEnum`.
    SortOrderEnum: Schema;
    defaultSortBy: string;
    defaultSortOrder: string;
    // `sortMapping` is the map from the sortBy in the `searchParams` to the `sortBy` and `sortOrder` in the searchOptions.
    sortMapping: {
      [sortBySearchParam: string]: {
        sortBy: string;
        sortOrder: string;
      };
    };
  };
  filterKeys: {
    name: string;
    type: Type;
  }[];
}

// This function translates the search params to valid search options.
export function fromSearchParamsToSearchOptions({
  searchParams: {query, offset, sortBy, ...filters},
  sortOptions: {
    SortByEnum,
    SortOrderEnum,
    defaultSortBy,
    defaultSortOrder,
    sortMapping,
  },
  filterKeys,
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
      .or(fallback(12)),
    filters: z.object(
      filterKeys.reduce(
        (acc, filterKey) => {
          if (filterKey.type === 'string') {
            acc[filterKey.name] = z.string().optional();
          } else if (filterKey.type === 'array') {
            acc[filterKey.name] = z
              .string()
              .transform(value => [value])
              .or(z.array(z.string().optional()))
              .optional()
              .or(fallback([]));
          } else if (filterKey.type === 'number') {
            acc[filterKey.name] = z
              .string()
              .transform(value => +value)
              .optional()
              .or(fallback(undefined));
          }

          return acc;
        },
        {} as {[key: string]: Schema}
      )
    ),
    sortBy: SortByEnum.or(fallback(defaultSortBy)),
    sortOrder: SortOrderEnum.or(fallback(defaultSortOrder)),
    query: z.string().optional(),
  });

  const {sortBy: sortBySearchOption, sortOrder} =
    (sortBy && sortMapping[sortBy as SortBy]) || {};

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
