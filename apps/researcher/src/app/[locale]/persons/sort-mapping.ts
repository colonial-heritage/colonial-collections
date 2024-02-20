import {
  SortBy as SortBySearchOption,
  SortOrder,
} from '@colonial-collections/api';

export enum SortByUserOption {
  BirthYearAsc = 'birthYearAsc',
  BirthYearDesc = 'birthYearDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export const defaultSortByUserOption = SortByUserOption.BirthYearDesc;

export const sortMapping = {
  [SortByUserOption.BirthYearDesc]: {
    sortBy: SortBySearchOption.BirthYear,
    sortOrder: SortOrder.Descending,
  },
  [SortByUserOption.BirthYearAsc]: {
    sortBy: SortBySearchOption.BirthYear,
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
