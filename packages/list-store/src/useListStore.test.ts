/**
 * @jest-environment jsdom
 */

import {renderHook, act} from '@testing-library/react';
import {useListStore} from './useListStore';
import {SortBy} from './sort';

describe('pageChange', () => {
  it('adds the `limit` to the `offset` if the new `offset` is not greater than the `totalCount`', () => {
    useListStore.setState({totalCount: 100, offset: 0, limit: 10});
    const {result} = renderHook(() => useListStore());

    act(() => {
      result.current.pageChange(1);
    });

    expect(result.current.offset).toBe(10);
  });

  it('subtracts the `limit` from the `offset` if the new offset is not smaller than 0', () => {
    useListStore.setState({totalCount: 100, offset: 20, limit: 10});
    const {result} = renderHook(() => useListStore());

    act(() => {
      result.current.pageChange(-1);
    });

    expect(result.current.offset).toBe(10);
  });

  it('does not set the `offset` higher than the `totalCount`', () => {
    useListStore.setState({totalCount: 12, offset: 10, limit: 10});
    const {result} = renderHook(() => useListStore());

    act(() => {
      result.current.pageChange(1);
    });

    expect(result.current.offset).toBe(12);
  });

  it('does not set the `offset` lower than 0', () => {
    useListStore.setState({totalCount: 100, offset: 0, limit: 10});
    const {result} = renderHook(() => useListStore());

    act(() => {
      result.current.pageChange(-1);
    });

    expect(result.current.offset).toBe(0);
  });
});

describe('setNewData', () => {
  it('sets all data if `isInitialized is `false`', () => {
    const initialData = {
      totalCount: 20,
      offset: 0,
      limit: 10,
      query: '',
      sortBy: SortBy.NameAsc,
      selectedFilters: {},
    };

    useListStore.setState(initialData);
    const {result} = renderHook(() => useListStore());

    const newData = {
      totalCount: 30,
      offset: 10,
      limit: 20,
      query: 'query',
      sortBy: SortBy.NameDesc,
      selectedFilters: {
        key: ['filter'],
      },
    };

    act(() => {
      result.current.setNewData(newData);
    });

    expect(result.current).toEqual(
      expect.objectContaining({
        ...newData,
        isInitialized: true,
      })
    );
  });

  it('does not set values the user can edit if initialized', () => {
    const initialData = {
      totalCount: 20,
      offset: 0,
      limit: 10,
      query: '',
      sortBy: SortBy.NameAsc,
      selectedFilters: {},
      isInitialized: true,
    };

    useListStore.setState(initialData);
    const {result} = renderHook(() => useListStore());

    const newData = {
      totalCount: 20,
      offset: 10,
      limit: 20,
      query: 'query',
      sortBy: SortBy.NameDesc,
      selectedFilters: {
        key: ['filter'],
      },
    };

    act(() => {
      result.current.setNewData(newData);
    });

    expect(result.current).toEqual(expect.objectContaining(initialData));
  });

  it('sets the `totalCount` if initialized', () => {
    const initialData = {
      totalCount: 20,
      isInitialized: true,
    };

    useListStore.setState(initialData);
    const {result} = renderHook(() => useListStore());

    const newData = {
      totalCount: 30,
      offset: 10,
      limit: 20,
      query: 'query',
      sortBy: SortBy.NameDesc,
      selectedFilters: {
        key: ['filter'],
      },
    };

    act(() => {
      result.current.setNewData(newData);
    });

    expect(result.current.totalCount).toBe(30);
  });
});
