export interface SearchResultFilter {
  name?: string | number;
  id: string | number;
  totalCount: number;
}

export enum FacetVariant {
  Default = 'default',
  Old = 'old',
}
