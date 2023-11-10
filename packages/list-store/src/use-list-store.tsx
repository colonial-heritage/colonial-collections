'use client';

import {createStore, useStore} from 'zustand';
import {useRef, createContext, useContext, PropsWithChildren} from 'react';
import {SearchParamsUpdater} from './search-params-updater';

interface ListProps {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  // Setting newDataNeeded to true will trigger a page reload with new search params
  newDataNeeded: boolean;
  isInitialized: boolean;
  defaultSortBy: string;
  selectedFilters: {
    [filterKey: string]: (string | number)[] | number | undefined;
  };
}

export interface ListState extends ListProps {
  filterChange: (
    key: string,
    value: (string | number)[] | number | undefined
  ) => void;
  sortChange: (sortBy: string) => void;
  queryChange: (query: string) => void;
  pageChange: (direction: 1 | -1) => void;
  transitionStarted: () => void;
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
  }));
};

type ListProviderProps = PropsWithChildren<Partial<ListProps>> & {
  defaultSortBy: string;
  baseUrl: string;
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

export function ListProvider({children, baseUrl, ...list}: ListProviderProps) {
  const storeRef = useRef<ListStore>();
  if (!storeRef.current) {
    storeRef.current = createListStore({...initialList, ...list});
  }

  return (
    <ListContext.Provider value={storeRef.current}>
      <SearchParamsUpdater
        baseUrl={baseUrl}
        defaultSortBy={list.defaultSortBy}
      />
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
