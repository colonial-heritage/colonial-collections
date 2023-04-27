import {create} from 'zustand';
import {getUrlWithSearchParams} from './search-params';
import {SortBy, defaultSortBy} from './sort';

export interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  // Setting newDataNeeded to true will trigger a page reload with new search params
  newDataNeeded: boolean;
  initialized: boolean;
  selectedFilters: {[filterKey: string]: string[] | undefined};
  setSelectedFilters: (key: string, value: string[]) => void;
  setSortBy: (sortBy: SortBy) => void;
  setQuery: (query: string) => void;
  setPage: (direction: 1 | -1) => void;
  composed: {
    urlWithSearchParams: string;
  };
  newServerData: ({
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
    sortBy: SortBy;
    selectedFilters: {[filterKey: string]: string[] | undefined};
  }) => void;
}

export const useListStore = create<Props>((set, get) => ({
  query: '',
  totalCount: 0,
  offset: 0,
  limit: 10,
  sortBy: defaultSortBy,
  selectedFilters: {},
  newDataNeeded: false,
  initialized: false,
  setSelectedFilters: (key, value) => {
    set({
      selectedFilters: {...get().selectedFilters, [key]: value},
      offset: 0,
      newDataNeeded: true,
    });
  },
  setSortBy: sortBy => {
    set({sortBy, offset: 0, newDataNeeded: true});
  },
  setQuery: query => {
    set({query, offset: 0, newDataNeeded: true});
  },
  setPage: direction => {
    let newOffset = get().offset + direction * get().limit;
    if (newOffset < 0) {
      newOffset = 0;
    }

    if (newOffset > get().totalCount) {
      newOffset = get().totalCount;
    }

    set({offset: newOffset, newDataNeeded: true});
  },
  newServerData: ({
    totalCount,
    offset,
    limit,
    query,
    sortBy,
    selectedFilters,
  }) => {
    if (!get().initialized) {
      set({
        totalCount,
        offset,
        limit,
        query,
        sortBy,
        selectedFilters,
        initialized: true,
      });
    } else if (totalCount !== get().totalCount) {
      // Don't reset the values the user can edit after initializing the client store.
      // Resetting these values could override user actions like typing.
      set({
        totalCount,
      });
    }
  },
  composed: {
    get urlWithSearchParams() {
      return getUrlWithSearchParams({
        query: get().query,
        offset: get().offset,
        sortBy: get().sortBy,
        filters: get().selectedFilters,
      });
    },
  },
}));
