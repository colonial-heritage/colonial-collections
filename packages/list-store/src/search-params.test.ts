import {getUrlWithSearchParams} from './search-params';
import {SortBy, defaultSortBy} from './sort';
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
