import {
  getUrlWithSearchParams,
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  FromSearchParamsToSearchOptionsProps,
} from './search-params';
import {SortBy, defaultSortBy} from './definitions';
import {describe, expect, it} from '@jest/globals';
import {z} from 'zod';

enum SortBySearchOption {
  Name = 'name',
  Relevance = 'relevance',
}

const SortByEnum = z.nativeEnum(SortBySearchOption);

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

const SortOrderEnum = z.nativeEnum(SortOrder);

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

const filterKeys: FromSearchParamsToSearchOptionsProps['filterKeys'] = [
  {name: 'types', type: 'array'},
  {name: 'locations', type: 'array'},
  {name: 'dateCreatedStart', type: 'number'},
  {name: 'dateCreatedEnd', type: 'number'},
];

const sortOptions = {
  SortByEnum,
  SortOrderEnum,
  defaultSortBy: SortBySearchOption.Relevance,
  defaultSortOrder: SortOrder.Descending,
  sortMapping,
};

describe('getUrlWithSearchParams', () => {
  it('returns "/" if there are no filter options', () => {
    expect(getUrlWithSearchParams({defaultSortBy})).toBe('/');
  });

  it('returns "/" with only default values', () => {
    const options = {
      offset: 0,
      sortBy: defaultSortBy,
      defaultSortBy,
    };

    expect(getUrlWithSearchParams(options)).toBe('/');
  });

  it('returns "/" with an empty query string', () => {
    const options = {
      query: '',
      defaultSortBy,
    };

    expect(getUrlWithSearchParams(options)).toBe('/');
  });

  it('returns "/" with empty filters', () => {
    const options = {
      query: '',
      defaultSortBy,
      filters: {
        types: [],
        locations: [],
        dateCreatedStart: undefined,
      },
    };

    expect(getUrlWithSearchParams(options)).toBe('/');
  });

  it('adds "query" to the search params if `query` is not empty', () => {
    const options = {
      query: 'my query',
      defaultSortBy,
    };

    expect(getUrlWithSearchParams(options)).toBe('/?query=my+query');
  });

  it('adds "offset" to the search params if `offset` is not 0', () => {
    const options = {
      offset: 12,
      defaultSortBy,
    };

    expect(getUrlWithSearchParams(options)).toBe('/?offset=12');
  });

  it('adds "sortBy" to the search params if `sortBy` is not the default', () => {
    const options = {
      sortBy: SortBy.NameAsc,
      defaultSortBy,
    };

    expect(getUrlWithSearchParams(options)).toBe('/?sortBy=nameAsc');
  });

  it('adds "filters" to the search params if the filter arrays are not empty', () => {
    const options = {
      defaultSortBy,
      filters: {
        types: ['filter1'],
        locations: ['filter2', 'filter3'],
        dateCreatedStart: 1600,
        dateCreatedEnd: 1700,
      },
    };

    expect(getUrlWithSearchParams(options)).toBe(
      '/?types=filter1&locations=filter2&locations=filter3&dateCreatedStart=1600&dateCreatedEnd=1700'
    );
  });

  it('adds all the params to the search params if present', () => {
    const options = {
      query: 'my query',
      offset: 20,
      sortBy: SortBy.NameDesc,
      defaultSortBy,
      filters: {
        types: ['filter1'],
        locations: ['filter2', 'filter3'],
        dateCreatedStart: 1600,
        dateCreatedEnd: 1700,
      },
    };

    expect(getUrlWithSearchParams(options)).toBe(
      '/?query=my+query&offset=20&sortBy=nameDesc&types=filter1&locations=filter2&locations=filter3&dateCreatedStart=1600&dateCreatedEnd=1700'
    );
  });
});

describe('fromSearchParamsToSearchOptions', () => {
  it('returns default search options if there are no search params', () => {
    expect(
      fromSearchParamsToSearchOptions({
        sortOptions,
        searchParams: {},
        filterKeys: [],
      })
    ).toStrictEqual({
      filters: {},
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 25,
      query: undefined,
    });
  });

  it('returns default search options if the search params contain defaults', () => {
    const searchParams = {
      offset: '0',
      sortBy: defaultSortBy,
    };

    expect(
      fromSearchParamsToSearchOptions({
        sortOptions,
        searchParams,
        filterKeys: [],
      })
    ).toStrictEqual({
      filters: {},
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 25,
      query: undefined,
    });
  });

  it('returns default search options if there are invalid search params', () => {
    const searchParams = {
      offset: 'string',
      sortBy: 'color',
    };

    expect(
      fromSearchParamsToSearchOptions({
        sortOptions,
        searchParams,
        filterKeys: [],
      })
    ).toStrictEqual({
      filters: {},
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 25,
      query: undefined,
    });
  });

  it('converts valid search params to search options', () => {
    const searchParams = {
      query: 'My query',
      offset: '12',
      sortBy: SortBy.NameAsc,
      types: ['type1', 'type2'],
      locations: 'location1',
      dateCreatedStart: '1500',
      dateCreatedEnd: '1550',
    };

    expect(
      fromSearchParamsToSearchOptions({
        sortOptions,
        searchParams,
        filterKeys,
      })
    ).toStrictEqual({
      query: 'My query',
      filters: {
        types: ['type1', 'type2'],
        locations: ['location1'],
        dateCreatedStart: 1500,
        dateCreatedEnd: 1550,
      },
      offset: 12,
      sortBy: 'name',
      sortOrder: 'asc',
      limit: 25,
    });
  });
});

describe('getClientSortBy', () => {
  it('returns the client SortBy', () => {
    expect(
      getClientSortBy({
        sortMapping,
        sortPair: {
          sortBy: SortBySearchOption.Relevance,
          sortOrder: SortOrder.Descending,
        },
      })
    ).toBe(SortBy.RelevanceDesc);
  });

  it('throws an error with an invalid sort pair', () => {
    expect(() =>
      getClientSortBy({
        sortMapping,
        sortPair: {
          sortBy: 'invalid',
          sortOrder: SortOrder.Descending,
        },
      })
    ).toThrow("Cannot read properties of undefined (reading '0')");
  });
});
