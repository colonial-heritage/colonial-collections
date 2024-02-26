import {Person, SearchResultFilter, SortBy, SortOrder} from '../definitions';

export type ConstituentSearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  constituents: Person[];
  filters: {
    birthYears: SearchResultFilter[];
    birthPlaces: SearchResultFilter[];
    deathYears: SearchResultFilter[];
    deathPlaces: SearchResultFilter[];
    publishers: SearchResultFilter[];
  };
};
