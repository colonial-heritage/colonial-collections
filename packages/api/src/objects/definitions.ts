import {
  HeritageObject,
  SearchResultFilter,
  SortBy,
  SortOrder,
} from '../definitions';

export type HeritageObjectSearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  heritageObjects: HeritageObject[];
  filters: {
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
