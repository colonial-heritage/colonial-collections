import {
  getUrlWithSearchParams,
  fromSearchParamsToSearchOptions,
  getClientSortBy,
} from './search-params';
import {SortBy, defaultSortBy} from './sort';
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

const sortOptions = {
  SortByEnum,
  SortOrderEnum,
  defaultSortBy: SortBySearchOption.Relevance,
  defaultSortOrder: SortOrder.Descending,
  sortMapping,
};

describe('getUrlWithSearchParams', () => {
  it('returns "/" if there are no options', () => {
    expect(getUrlWithSearchParams({})).toBe('/');
  });

  it('returns "/" with only default values', () => {
    const options = {
      offset: 0,
      sortBy: defaultSortBy,
    };

    expect(getUrlWithSearchParams(options)).toBe('/');
  });

  it('returns "/" with an empty query string', () => {
    const options = {
      query: '',
    };

    expect(getUrlWithSearchParams(options)).toBe('/');
  });

  it('returns "/" with empty filter arrays', () => {
    const options = {
      query: '',
      filters: {
        licenses: [],
        publishers: [],
        spatialCoverages: [],
        genres: [],
      },
    };

    expect(getUrlWithSearchParams(options)).toBe('/');
  });

  it('adds "query" to the search params if `query` is not empty', () => {
    const options = {
      query: 'my query',
    };

    expect(getUrlWithSearchParams(options)).toBe('/?query=my+query');
  });

  it('adds "offset" to the search params if `offset` is not 0', () => {
    const options = {
      offset: 12,
    };

    expect(getUrlWithSearchParams(options)).toBe('/?offset=12');
  });

  it('adds "sortBy" to the search params if `sortBy` is not the default', () => {
    const options = {
      sortBy: SortBy.NameAsc,
    };

    expect(getUrlWithSearchParams(options)).toBe('/?sortBy=nameAsc');
  });

  it('adds "filters" to the search params if the filter arrays are not empty', () => {
    const options = {
      filters: {
        licenses: ['filter1'],
        publishers: ['filter2'],
        spatialCoverages: ['filter3'],
        genres: ['filter4'],
      },
    };

    expect(getUrlWithSearchParams(options)).toBe(
      '/?licenses=filter1&publishers=filter2&spatialCoverages=filter3&genres=filter4'
    );
  });

  it('adds all the params to the search params if present', () => {
    const options = {
      query: 'my query',
      offset: 20,
      sortBy: SortBy.NameDesc,
      filters: {
        licenses: ['filter1', 'filter2'],
        publishers: ['filter3'],
        spatialCoverages: ['filter4'],
        genres: ['filter5'],
      },
    };

    expect(getUrlWithSearchParams(options)).toBe(
      '/?query=my+query&offset=20&sortBy=nameDesc&licenses=filter1%2Cfilter2&publishers=filter3&spatialCoverages=filter4&genres=filter5'
    );
  });
});

describe('fromSearchParamsToSearchOptions', () => {
  it('returns default search options if there are no search params', () => {
    expect(
      fromSearchParamsToSearchOptions({sortOptions, searchParams: {}})
    ).toStrictEqual({
      filters: {},
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 12,
      query: undefined,
    });
  });

  it('returns default search options if the search params contain defaults', () => {
    const searchParams = {
      offset: '0',
      sortBy: defaultSortBy,
    };

    expect(
      fromSearchParamsToSearchOptions({sortOptions, searchParams})
    ).toStrictEqual({
      filters: {},
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 12,
      query: undefined,
    });
  });

  it('returns default search options if there are invalid search params', () => {
    const searchParams = {
      offset: 'string',
      sortBy: 'color',
    };

    expect(
      fromSearchParamsToSearchOptions({sortOptions, searchParams})
    ).toStrictEqual({
      filters: {},
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 12,
      query: undefined,
    });
  });

  it('converts valid search params to search options', () => {
    const searchParams = {
      query: 'My query',
      offset: '12',
      sortBy: SortBy.NameAsc,
      owners: 'owner1,owner2',
      types: 'type',
      subjects: 'subject',
    };

    expect(
      fromSearchParamsToSearchOptions({sortOptions, searchParams})
    ).toStrictEqual({
      query: 'My query',
      filters: {
        owners: ['owner1', 'owner2'],
        types: ['type'],
        subjects: ['subject'],
      },
      offset: 12,
      sortBy: 'name',
      sortOrder: 'asc',
      limit: 12,
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
