import {
  getUrlWithSearchParams,
  fromSearchParamsToSearchOptions,
  defaultSortBy,
  getClientSortBy,
  SortBy,
} from './search-params';
import {SortBy as SortBySearchOption, SortOrder} from '@/lib/dataset-fetcher';
import {describe, expect, it} from '@jest/globals';

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
      licenses: [],
      publishers: [],
      spatialCoverages: [],
      genres: [],
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
      offset: 10,
    };
    expect(getUrlWithSearchParams(options)).toBe('/?offset=10');
  });

  it('adds "sortBy" to the search params if `sortBy` is not the default', () => {
    const options = {
      sortBy: SortBy.NameAsc,
    };
    expect(getUrlWithSearchParams(options)).toBe('/?sortBy=nameAsc');
  });

  it('adds "filters" to the search params if the filter arrays are not empty', () => {
    const options = {
      licenses: ['filter1'],
      publishers: ['filter2'],
      spatialCoverages: ['filter3'],
      genres: ['filter4'],
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
      licenses: ['filter1', 'filter2'],
      publishers: ['filter3'],
      spatialCoverages: ['filter4'],
      genres: ['filter5'],
    };
    expect(getUrlWithSearchParams(options)).toBe(
      '/?query=my+query&offset=20&licenses=filter1%2Cfilter2&publishers=filter3&spatialCoverages=filter4&genres=filter5&sortBy=nameDesc'
    );
  });
});

describe('fromSearchParamsToSearchOptions', () => {
  it('returns default search options if there are no search params', () => {
    expect(fromSearchParamsToSearchOptions({})).toStrictEqual({
      filters: {
        licenses: [],
        publishers: [],
        spatialCoverages: [],
        genres: [],
      },
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 10,
      query: undefined,
    });
  });

  it('returns default search options if the search params contain defaults', () => {
    const searchParams = {
      offset: '0',
      sortBy: defaultSortBy,
    };
    expect(fromSearchParamsToSearchOptions(searchParams)).toStrictEqual({
      filters: {
        licenses: [],
        publishers: [],
        spatialCoverages: [],
        genres: [],
      },
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 10,
      query: undefined,
    });
  });

  it('returns default search options if there are invalid search params', () => {
    const searchParams = {
      offset: 'string',
      sortBy: 'color',
      notValidParam: 'notValid',
    };
    // @ts-expect-error:TS2553
    expect(fromSearchParamsToSearchOptions(searchParams)).toStrictEqual({
      filters: {
        licenses: [],
        publishers: [],
        spatialCoverages: [],
        genres: [],
      },
      offset: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 10,
      query: undefined,
    });
  });

  it('converts valid search params to search options', () => {
    const searchParams = {
      query: 'My query',
      offset: '10',
      sortBy: SortBy.NameAsc,
      licenses: 'license1,license2',
      publishers: 'publisher',
      spatialCoverages: 'spatial-coverage',
      genres: 'genre',
    };
    expect(fromSearchParamsToSearchOptions(searchParams)).toStrictEqual({
      query: 'My query',
      filters: {
        licenses: ['license1', 'license2'],
        publishers: ['publisher'],
        spatialCoverages: ['spatial-coverage'],
        genres: ['genre'],
      },
      offset: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      limit: 10,
    });
  });
});

describe('getClientSortBy', () => {
  it('finds the client SortBy', () => {
    expect(
      getClientSortBy({
        sortBy: SortBySearchOption.Relevance,
        sortOrder: SortOrder.Descending,
      })
    ).toBe(SortBy.RelevanceDesc);
  });

  it('throws an error with an invalid sort pair', () => {
    expect(() =>
      getClientSortBy({
        // @ts-expect-error:TS2553
        sortBy: 'invalid',
        sortOrder: SortOrder.Descending,
      })
    ).toThrow("Cannot read properties of undefined (reading '0')");
  });
});
