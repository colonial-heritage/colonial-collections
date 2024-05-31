'use client';

import {useStore} from 'zustand';
import {createStore} from 'zustand/vanilla';
import {useRef, createContext, useContext, PropsWithChildren} from 'react';
import {ImageFetchMode, ListView} from './definitions';

interface ListProps<SortBy> {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  view?: ListView;
  imageFetchMode?: ImageFetchMode;
  // Setting newDataNeeded to true will trigger a page reload with new search params
  newDataNeeded: boolean;
  isInitialized: boolean;
  defaultSortBy: SortBy;
  defaultView?: ListView;
  defaultImageFetchMode?: ImageFetchMode;
  baseUrl: string;
  selectedFilters: {
    [filterKey: string]: (string | number)[] | number | string | undefined;
  };
}

export interface ListState<SortBy> extends ListProps<SortBy> {
  filterChange: (
    key: string,
    value: (string | number)[] | number | string | undefined
  ) => void;
  sortChange: (sortBy: SortBy) => void;
  queryChange: (query: string) => void;
  limitChange: (limit: number) => void;
  pageChange: (direction: 1 | -1) => void;
  viewChange: (view: ListView) => void;
  imageFetchModeChange: (imageFetchMode: ImageFetchMode) => void;
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
    sortBy?: SortBy;
    selectedFilters: ListProps<SortBy>['selectedFilters'];
    view?: ListProps<SortBy>['view'];
    imageFetchMode?: ListProps<SortBy>['imageFetchMode'];
  }) => void;
}

export type ListStore<SortBy> = ReturnType<typeof createListStore<SortBy>>;

export function createListStore<SortBy>(initProps: ListProps<SortBy>) {
  return createStore<ListState<SortBy>>()((set, get) => ({
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
      set({
        newDataNeeded: false,
      });
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListContext = createContext<ListStore<any> | null>(null);

export const initialList = {
  query: '',
  totalCount: 0,
  offset: 0,
  limit: 25,
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

export type ListProviderProps<SortBy> = PropsWithChildren<{
  defaultSortBy: SortBy;
  defaultView?: ListView;
  defaultImageFetchMode?: ImageFetchMode;
  baseUrl: string;
}>;

export function ListProvider<SortBy>({
  children,
  defaultSortBy,
  defaultView,
  defaultImageFetchMode,
  baseUrl,
}: ListProviderProps<SortBy>) {
  const storeRef = useRef<ListStore<SortBy>>();
  if (!storeRef.current) {
    storeRef.current = createListStore<SortBy>({
      ...initialList,
      defaultSortBy,
      defaultView,
      defaultImageFetchMode,
      sortBy: defaultSortBy,
      view: defaultView,
      // Set the default `imageFetchMode` to none so images won't load by default.
      // As soon as the search results are loaded this will be overridden by the user setting.
      imageFetchMode: ImageFetchMode.None,
      baseUrl,
    });
  }

  return (
    <ListContext.Provider value={storeRef.current}>
      {children}
    </ListContext.Provider>
  );
}

export function useListStore<T, SortBy>(
  selector?: (state: ListState<SortBy>) => T
) {
  const store = useContext(ListContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  return useStore(store, selector!);
}
