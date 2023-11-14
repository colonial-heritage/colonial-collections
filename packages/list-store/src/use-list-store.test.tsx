/**
 * @jest-environment jsdom
 */

import {
  useListStore,
  createListStore,
  initialList,
  ListProvider,
} from './use-list-store';
import {SortBy, defaultSortBy} from './sort';
import {renderHook} from '@testing-library/react';

const initialState = {
  ...initialList,
  defaultSortBy,
  sortBy: defaultSortBy,
  baseUrl: '/',
};

describe('useListStore', () => {
  it('returns the selected state from the store', () => {
    const {result} = renderHook(() => useListStore(s => s.defaultSortBy), {
      wrapper: ({children}) => (
        <ListProvider baseUrl="/" defaultSortBy={SortBy.NameAsc}>
          {children}
        </ListProvider>
      ),
    });
    expect(result.current).toBe(SortBy.NameAsc);
  });

  it('throws an error if the store is missing', () => {
    expect(() => {
      renderHook(() => useListStore(s => s), {
        wrapper: ({children}) => <>{children}</>,
      });
    }).toThrow('Missing StoreProvider');
  });
});

describe('createListStore', () => {
  it('adds the `limit` to the `offset` if the new `offset` is not greater than the `totalCount`', () => {
    const store = createListStore({
      ...initialState,
      totalCount: 100,
      offset: 0,
      limit: 12,
    });

    store.getState().pageChange(1);

    expect(store.getState().offset).toBe(12);
  });

  it('subtracts the `limit` from the `offset` if the new offset is not smaller than 0', () => {
    const store = createListStore({
      ...initialState,
      totalCount: 100,
      offset: 24,
      limit: 12,
    });

    store.getState().pageChange(-1);

    expect(store.getState().offset).toBe(12);
  });

  it('does not set the `offset` higher than the `totalCount`', () => {
    const store = createListStore({
      ...initialState,
      totalCount: 12,
      offset: 12,
      limit: 12,
    });

    store.getState().pageChange(1);

    expect(store.getState().offset).toBe(12);
  });

  it('does not set the `offset` lower than 0', () => {
    const store = createListStore({
      ...initialState,
      totalCount: 100,
      offset: 0,
      limit: 12,
    });

    store.getState().pageChange(-1);

    expect(store.getState().offset).toBe(0);
  });

  it('changes the `sortBy` state when called', () => {
    const store = createListStore(initialState);

    store.getState().sortChange(SortBy.NameAsc);

    expect(store.getState().sortBy).toBe(SortBy.NameAsc);
  });

  it('changes the `query` state when called', () => {
    const store = createListStore(initialState);

    store.getState().queryChange('new query');

    expect(store.getState().query).toBe('new query');
  });

  it('updates the `selectedFilters` state when `filterChange` is called', () => {
    const store = createListStore(initialState);

    const filterKey = 'filter1';
    const filterValue = ['value1'];
    store.getState().filterChange(filterKey, filterValue);

    expect(store.getState().selectedFilters).toEqual({
      [filterKey]: filterValue,
    });
  });

  it('resets the `offset` state when `filterChange` is called', () => {
    const store = createListStore({
      ...initialState,
      offset: 10,
    });

    const filterKey = 'filter1';
    const filterValue = ['value1'];
    store.getState().filterChange(filterKey, filterValue);

    expect(store.getState().offset).toBe(0);
  });

  it('sets `newDataNeeded` to `true` when `filterChange` is called', () => {
    const store = createListStore({
      ...initialState,
      newDataNeeded: false,
    });

    const filterKey = 'filter1';
    const filterValue = ['value1'];
    store.getState().filterChange(filterKey, filterValue);

    expect(store.getState().newDataNeeded).toBe(true);
  });

  it('updates the `selectedFilters` state with multiple filters when `filterChange` is called', () => {
    const store = createListStore(initialState);

    const filterKey1 = 'filter1';
    const filterValue1 = ['value1'];
    store.getState().filterChange(filterKey1, filterValue1);

    const filterKey2 = 'filter2';
    const filterValue2 = ['value2'];
    store.getState().filterChange(filterKey2, filterValue2);

    expect(store.getState().selectedFilters).toEqual({
      [filterKey1]: filterValue1,
      [filterKey2]: filterValue2,
    });
  });
});
