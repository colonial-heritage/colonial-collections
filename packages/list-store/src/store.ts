import {create} from 'zustand';
import {getUrlWithSearchParams} from './search-params';
import {SortBy, defaultSortBy} from './sort';

export interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  query: string;
  sortBy: SortBy;
  selectedFilters: {[filterKey: string]: string[] | undefined};
  setSelectedFilters: (key: string, value: string[]) => void;
  setSortBy: (sortBy: SortBy) => void;
  setQuery: (query: string) => void;
  setOffset: (offset: number) => void;
  setPage: (direction: 1 | -1) => void;
  composed: {
    urlWithSearchParams: string;
  };
}

export const useListStore = create<Props>((set, get) => ({
  query: '',
  totalCount: 0,
  offset: 0,
  limit: 10,
  sortBy: defaultSortBy,
  selectedFilters: {},
  setSelectedFilters: (key, value) => {
    set({selectedFilters: {...get().selectedFilters, [key]: value}, offset: 0});
  },
  setSortBy: sortBy => {
    set({sortBy, offset: 0});
  },
  setQuery: query => {
    set({query, offset: 0});
  },
  setOffset: offset => {
    set({offset});
  },
  setPage: direction => {
    let newOffset = get().offset + direction * get().limit;
    if (newOffset < 0) {
      newOffset = 0;
    }

    if (newOffset > get().totalCount) {
      newOffset = get().totalCount;
    }

    set({offset: newOffset});
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
