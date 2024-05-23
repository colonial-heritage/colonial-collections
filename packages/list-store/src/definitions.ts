export enum SortBy {
  RelevanceDesc = 'relevanceDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export const defaultSortBy = SortBy.RelevanceDesc;

export enum ListView {
  Grid = 'grid',
  List = 'list',
}

export enum ImageFetchMode {
  None = 'none',
  Small = 'small',
  Large = 'large',
}
