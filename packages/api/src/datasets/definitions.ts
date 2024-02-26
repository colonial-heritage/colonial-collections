import {Dataset, SearchResultFilter, SortBy, SortOrder} from '../definitions';

export type DatasetSearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  datasets: Dataset[];
  filters: {
    publishers: SearchResultFilter[];
    licenses: SearchResultFilter[];
  };
};
