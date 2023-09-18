import {create} from 'zustand';

export interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy?: string;
  // Setting newDataNeeded to true will trigger a page reload with new search params
  newDataNeeded: boolean;
  isInitialized: boolean;
  defaultSortBy?: string;
  selectedFilters: {[filterKey: string]: string[] | undefined};
  filterChange: (key: string, value: string[]) => void;
  sortChange: (sortBy: string) => void;
  queryChange: (query: string) => void;
  pageChange: (direction: 1 | -1) => void;
  setNewData: ({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
    defaultSortBy,
  }: {
    totalCount: number;
    offset: number;
    limit: number;
    query: string;
    sortBy: string;
    selectedFilters: {[filterKey: string]: string[] | undefined};
    defaultSortBy: string;
  }) => void;
  transitionStarted: () => void;
}

export const useListStore = create<Props>((set, get) => ({
  query: '',
  totalCount: 0,
  offset: 0,
  limit: 10,
  sortBy: undefined,
  defaultSortBy: undefined,
  selectedFilters: {},
  newDataNeeded: false,
  isInitialized: false,
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
  setNewData: ({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
    defaultSortBy,
  }) => {
    if (!get().isInitialized) {
      set({
        totalCount,
        offset,
        limit,
        query,
        sortBy,
        selectedFilters,
        defaultSortBy,
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
  transitionStarted: () => {
    set({newDataNeeded: false});
  },
}));
