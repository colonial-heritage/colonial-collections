'use client';

import {createStore, useStore} from 'zustand';
import {useRef, createContext, useContext, PropsWithChildren} from 'react';

interface ListProps {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: string;
  view?: string;
  imageFetchMode?: string;
  // Setting newDataNeeded to true will trigger a page reload with new search params
  newDataNeeded: boolean;
  isInitialized: boolean;
  defaultSortBy: string;
  defaultView?: string;
  defaultImageFetchMode?: string;
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
  limitChange: (limit: number) => void;
  pageChange: (direction: 1 | -1) => void;
  viewChange: (view: string) => void;
  imageFetchModeChange: (imageFetchMode: string) => void;
  transitionStarted: () => void;
  setNewData: ({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
    view,
    imageFetchMode,
  }: {
    totalCount: number;
    offset: number;
    limit: number;
    query: string;
    sortBy?: string;
    selectedFilters: ListProps['selectedFilters'];
    view?: ListProps['view'];
    imageFetchMode?: ListProps['imageFetchMode'];
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
    viewChange: view => {
      set({view, newDataNeeded: true});
    },
    imageFetchModeChange: imageFetchMode => {
      set({imageFetchMode, newDataNeeded: true});
    },
    limitChange: limit => {
      set({limit, offset: 0, newDataNeeded: true});
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
      view,
      imageFetchMode,
    }) => {
      if (!get().isInitialized) {
        set({
          totalCount,
          offset,
          limit,
          query,
          sortBy: sortBy || get().defaultSortBy,
          view: view || get().defaultView,
          imageFetchMode: imageFetchMode || get().defaultImageFetchMode,
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
  limit: 20,
  sortBy: undefined,
  defaultSortBy: undefined,
  defaultView: undefined,
  defaultImageFetchMode: undefined,
  selectedFilters: {},
  newDataNeeded: false,
  isInitialized: false,
  view: undefined,
  imageFetchMode: undefined,
} as const;

export type ListProviderProps = PropsWithChildren<{
  defaultSortBy: string;
  defaultView?: string;
  defaultImageFetchMode?: string;
  baseUrl: string;
}>;

export function ListProvider({
  children,
  defaultSortBy,
  defaultView,
  defaultImageFetchMode,
  baseUrl,
}: ListProviderProps) {
  const storeRef = useRef<ListStore>();
  if (!storeRef.current) {
    storeRef.current = createListStore({
      ...initialList,
      defaultSortBy,
      defaultView,
      // Don't set `imageFetchMode` to `defaultImageFetchMode` here so images won't load by default.
      // Set the value in the setNewData method instead, so we know if the user changed the value.
      defaultImageFetchMode,
      sortBy: defaultSortBy,
      view: defaultView,
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
