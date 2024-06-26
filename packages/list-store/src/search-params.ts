import {z, Schema} from 'zod';
import {ImageFetchMode, ListView} from './definitions';

export type Type = 'string' | 'array' | 'number';

// Only strings are allowed in the search params.
const searchParamFilterSchema = z
  .array(z.coerce.string())
  .or(z.coerce.string())
  .default('');

interface GetSearchParamsSchemaProps<SortBy> {
  defaultSortBy: SortBy;
  defaultView?: ListView;
  defaultImageFetchMode?: ImageFetchMode;
  defaultLimit: number;
}

function transformToStringAndRemoveDefaultSchema(defaultValue?: string) {
  return z.coerce
    .string()
    .default('')
    .transform(value => (value === defaultValue ? '' : value));
}

function getSearchParamsSchema<SortBy>({
  defaultSortBy,
  defaultView,
  defaultImageFetchMode,
  defaultLimit,
}: GetSearchParamsSchemaProps<SortBy>) {
  return z.object({
    query: z.string().default(''),
    offset: transformToStringAndRemoveDefaultSchema('0'),
    limit: transformToStringAndRemoveDefaultSchema(`${defaultLimit}`),
    view: transformToStringAndRemoveDefaultSchema(defaultView),
    imageFetchMode: transformToStringAndRemoveDefaultSchema(
      defaultImageFetchMode
    ),
    sortBy: transformToStringAndRemoveDefaultSchema(defaultSortBy as string),
  });
}

interface ClientSearchOptions<SortBy> {
  query?: string;
  offset?: number;
  limit?: number;
  view?: ListView;
  imageFetchMode?: ImageFetchMode;
  sortBy?: SortBy;
  filters?: {
    [filterKey: string]: (string | number)[] | string | number | undefined;
  };
  baseUrl?: string;
  defaultSortBy: SortBy;
  defaultView?: ListView;
  defaultImageFetchMode?: ImageFetchMode;
  defaultLimit: number;
}

export function getUrlWithSearchParams<SortBy>({
  query,
  offset,
  limit,
  view,
  imageFetchMode,
  sortBy,
  filters,
  baseUrl = '/',
  defaultSortBy,
  defaultImageFetchMode,
  defaultView,
  defaultLimit,
}: ClientSearchOptions<SortBy>): string {
  const searchParams: {[key: string]: string | string[]} =
    getSearchParamsSchema({
      defaultSortBy,
      defaultImageFetchMode,
      defaultView,
      defaultLimit,
    }).parse({
      query,
      offset,
      limit,
      view,
      imageFetchMode,
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
  defaultLimit: number;
}

// This function translates the search params to valid search options.
export function fromSearchParamsToSearchOptions({
  searchParams: {query, offset, sortBy, limit, ...filters},
  sortOptions: {
    SortByEnum,
    SortOrderEnum,
    defaultSortBy,
    defaultSortOrder,
    sortMapping,
  },
  filterKeys,
  defaultLimit,
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
      .or(fallback(defaultLimit)),
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
    (sortBy && sortMapping[sortBy as string]) || {};

  const searchOptions = searchOptionsWithFallbackSchema.parse({
    offset,
    filters,
    sortBy: sortBySearchOption,
    sortOrder: sortOrder,
    query,
    limit,
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

export function getClientSortBy<SortBySearchOption, SortOrder, SortBy>({
  sortPair,
  sortMapping,
}: SortPairProps<SortBySearchOption, SortOrder>): SortBy {
  return Object.entries(sortMapping).find(
    ([, {sortBy, sortOrder}]) =>
      sortPair.sortBy === sortBy && sortPair.sortOrder === sortOrder
  )![0] as SortBy;
}
