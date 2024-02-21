import {
  SortBy as SortBySearchOption,
  SortOrder,
} from '@colonial-collections/api';
import {SortBy} from '@colonial-collections/list-store';

export const sortMapping = {
  [SortBy.NameAsc]: {
    sortBy: SortBySearchOption.Name,
    sortOrder: SortOrder.Ascending,
  },
  [SortBy.NameDesc]: {
    sortBy: SortBySearchOption.Name,
    sortOrder: SortOrder.Descending,
  },
};
