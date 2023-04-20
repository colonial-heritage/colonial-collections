import {
  fromSearchParamsToSearchOptions,
  getClientSortBy,
} from './search-params';
import {SortBy, defaultSortBy} from 'list-store';
import {SortBy as SortBySearchOption, SortOrder} from '@/lib/heritage-fetcher';
import {describe, expect, it} from '@jest/globals';

describe('fromSearchParamsToSearchOptions', () => {
  it('returns default search options if there are no search params', () => {
    expect(fromSearchParamsToSearchOptions({})).toStrictEqual({
      filters: {
        owners: [],
        types: [],
        subjects: [],
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
        owners: [],
        types: [],
        subjects: [],
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
        owners: [],
        types: [],
        subjects: [],
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
      owners: 'owner1,owner2',
      types: 'type',
      subjects: 'subject',
    };
    expect(fromSearchParamsToSearchOptions(searchParams)).toStrictEqual({
      query: 'My query',
      filters: {
        owners: ['owner1', 'owner2'],
        types: ['type'],
        subjects: ['subject'],
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
