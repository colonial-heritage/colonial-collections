import {
  HeritageObject,
  SearchResultFilter,
  SortBy,
  SortOrder,
} from '../definitions';

export type SearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  heritageObjects: HeritageObject[];
  filters: {
    owners: SearchResultFilter[];
    types: SearchResultFilter[];
    subjects: SearchResultFilter[];
    locations: SearchResultFilter[];
    materials: SearchResultFilter[];
    creators: SearchResultFilter[];
    publishers: SearchResultFilter[];
    dateCreatedStart: SearchResultFilter[];
    dateCreatedEnd: SearchResultFilter[];
  };
};
