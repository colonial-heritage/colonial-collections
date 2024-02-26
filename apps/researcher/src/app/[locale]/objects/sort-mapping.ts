import {
  SortBy as SortBySearchOption,
  SortOrder,
} from '@colonial-collections/api';

export enum SortByUserOption {
  DateCreatedDesc = 'dateCreatedDesc',
  DateCreatedAsc = 'dateCreatedAsc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export const defaultSortByUserOption = SortByUserOption.DateCreatedDesc;

export const sortMapping = {
  [SortByUserOption.DateCreatedDesc]: {
    sortBy: SortBySearchOption.DateCreated,
    sortOrder: SortOrder.Descending,
  },
  [SortByUserOption.DateCreatedAsc]: {
    sortBy: SortBySearchOption.DateCreated,
    sortOrder: SortOrder.Ascending,
  },
  [SortByUserOption.NameAsc]: {
    sortBy: SortBySearchOption.Name,
    sortOrder: SortOrder.Ascending,
  },
  [SortByUserOption.NameDesc]: {
    sortBy: SortBySearchOption.Name,
    sortOrder: SortOrder.Descending,
  },
};
