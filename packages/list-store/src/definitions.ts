export enum SortBy {
  RelevanceDesc = 'relevanceDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
}

export const defaultSortBy = SortBy.NameAsc;

export enum ListView {
  Grid = 'grid',
  List = 'list',
}

export enum ImageFetchMode {
  None = 'none',
  Small = 'small',
  Large = 'large',
}

export const defaultImageFetchMode = ImageFetchMode.Large;

export const defaultLimit = 25;
