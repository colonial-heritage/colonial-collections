'use client';

import {createStore, useStore} from 'zustand';
import {useRef, createContext, useContext, PropsWithChildren} from 'react';

interface ListProps {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: string;
  // Setting newDataNeeded to true will trigger a page reload with new search params
  newDataNeeded: boolean;
  isInitialized: boolean;
  defaultSortBy: string;
  baseUrl: string;
  selectedFilters: {
    [filterKey: string]: (string | number)[] | number | string | undefined;
  };
}

export interface ListState extends ListProps {
  filterChange: (
    key: string,
    value: (string | number)[] | number | string | undefined
  ) => void;
  sortChange: (sortBy: string) => void;
  queryChange: (query: string) => void;
  pageChange: (direction: 1 | -1) => void;
  transitionStarted: () => void;
  setNewData: ({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
  }: {
    totalCount: number;
    offset: number;
    limit: number;
    query: string;
    sortBy?: string;
    selectedFilters: ListProps['selectedFilters'];
  }) => void;
}

export type ListStore = ReturnType<typeof createListStore>;

export const createListStore = (initProps: ListProps) => {
  return createStore<ListState>()((set, get) => ({
    ...initProps,
    filterChange: (key, value) => {
      set({
        selectedFilters: {...get().selectedFilters, [key]: value},
        offset: 0,
        newDataNeeded: true,
      });
    },
    sortChange: sortBy => {
      set({sortBy, offset: 0, newDataNeeded: true});
    },
    queryChange: query => {
      set({query, offset: 0, newDataNeeded: true});
    },
    pageChange: direction => {
      let newOffset = get().offset + direction * get().limit;
      if (newOffset < 0) {
        newOffset = 0;
      }

      if (newOffset > get().totalCount) {
        newOffset = get().totalCount;
      }

      set({offset: newOffset, newDataNeeded: true});
    },
    transitionStarted: () => {
      set({newDataNeeded: false});
    },
    setNewData: ({
      totalCount,
      offset,
      limit,
      query,
      sortBy,
      selectedFilters,
    }) => {
      if (!get().isInitialized) {
        set({
          totalCount,
          offset,
          limit,
          query,
          sortBy: sortBy || get().defaultSortBy,
          selectedFilters,
          isInitialized: true,
        });
      } else if (totalCount !== get().totalCount) {
        // Don't reset the values the user can edit after initializing the client store.
        // Resetting these values could override user actions like typing.
        set({
          totalCount,
        });
      }
    },
  }));
};

export const ListContext = createContext<ListStore | null>(null);

export const initialList = {
  query: '',
  totalCount: 0,
  offset: 0,
  limit: 10,
  sortBy: undefined,
  defaultSortBy: undefined,
  selectedFilters: {},
  newDataNeeded: false,
  isInitialized: false,
};

export type ListProviderProps = PropsWithChildren<{
  defaultSortBy: string;
  baseUrl: string;
}>;

export function ListProvider({
  children,
  defaultSortBy,
  baseUrl,
}: ListProviderProps) {
  const storeRef = useRef<ListStore>();
  if (!storeRef.current) {
    storeRef.current = createListStore({
      ...initialList,
      defaultSortBy,
      sortBy: defaultSortBy,
      baseUrl,
    });
  }

  return (
    <ListContext.Provider value={storeRef.current}>
      {children}
    </ListContext.Provider>
  );
}

export function useListStore<T>(
  selector?: (state: ListState) => T,
  equals?: (a: T, b: T) => boolean
) {
  const store = useContext(ListContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  return useStore(store, selector!, equals);
}
