import {
  getLetterCategories,
  getFiltersWithLetterCategory,
  getFilteredFilters,
  SearchableFilter,
  Filter,
} from './use-searchable-facet';

describe('getLetterCategories', () => {
  it('returns an array of unique letter categories sorted alphabetically', () => {
    const filters = [
      {letterCategory: 'B', name: 'B Filter', id: '1', totalCount: 1},
      {letterCategory: 'A', name: ' "A Filter" ', id: '2', totalCount: 1},
      {letterCategory: '[0-9]', name: '1 Filter', id: '3', totalCount: 1},
      {letterCategory: 'B', name: 'B2 Filter', id: '4', totalCount: 1},
    ];
    const result = getLetterCategories(filters);
    expect(result).toEqual(['A', 'B', '[0-9]']);
  });

  it('returns an empty array if no filters are provided', () => {
    const filters: SearchableFilter[] = [];
    const result = getLetterCategories(filters);
    expect(result).toEqual([]);
  });
});
describe('getFiltersWithLetterCategory', () => {
  it('adds a letter category to each filter based on the first letter of its name', () => {
    const filters = [
      {name: 'Apple', id: '1', totalCount: 1},
      {name: 'Banana', id: '2', totalCount: 1},
      {name: 'Cherry', id: '3', totalCount: 1},
      {name: '1 Filter', id: '4', totalCount: 1},
    ];
    const expectedFilters = [
      {name: 'Apple', id: '1', totalCount: 1, letterCategory: 'A'},
      {name: 'Banana', id: '2', totalCount: 1, letterCategory: 'B'},
      {name: 'Cherry', id: '3', totalCount: 1, letterCategory: 'C'},
      {name: '1 Filter', id: '4', totalCount: 1, letterCategory: '[0-9]'},
    ];
    const result = getFiltersWithLetterCategory(filters);
    expect(result).toEqual(expectedFilters);
  });

  it('handles filters with non-string names', () => {
    const filters = [
      {name: 123, id: '1', totalCount: 1},
      {name: undefined, id: '2', totalCount: 1},
    ];
    const expectedFilters = [
      {name: '123', id: '1', totalCount: 1, letterCategory: '[0-9]'},
      {name: '', id: '2', totalCount: 1, letterCategory: ''},
    ];
    const result = getFiltersWithLetterCategory(filters);
    expect(result).toEqual(expectedFilters);
  });

  it('handles empty filters array', () => {
    const filters: Filter[] = [];
    const expectedFilters: SearchableFilter[] = [];
    const result = getFiltersWithLetterCategory(filters);
    expect(result).toEqual(expectedFilters);
  });
});
describe('getFilteredFilters', () => {
  const filters = [
    {name: 'Apple', id: '1', totalCount: 1, letterCategory: 'A'},
    {name: 'Banana', id: '2', totalCount: 2, letterCategory: 'B'},
    {name: '1 Filter', id: '3', totalCount: 4, letterCategory: '[0-9]'},
    {name: 'Cherry', id: '4', totalCount: 3, letterCategory: 'C'},
  ];

  it('filters by search value', () => {
    const result = getFilteredFilters({
      filtersWithLetterCategory: filters,
      searchValue: 'app',
      letterCategory: '',
      sortBy: 'count',
    });
    expect(result).toEqual([
      {name: 'Apple', id: '1', totalCount: 1, letterCategory: 'A'},
    ]);
  });

  it('filters by letter category', () => {
    const result = getFilteredFilters({
      filtersWithLetterCategory: filters,
      searchValue: '',
      letterCategory: 'B',
      sortBy: 'count',
    });
    expect(result).toEqual([
      {name: 'Banana', id: '2', totalCount: 2, letterCategory: 'B'},
    ]);
  });

  it('sorts alphabetically', () => {
    const result = getFilteredFilters({
      filtersWithLetterCategory: filters,
      searchValue: '',
      letterCategory: '',
      sortBy: 'alphabetical',
    });
    expect(result).toEqual([
      {name: '1 Filter', id: '3', totalCount: 4, letterCategory: '[0-9]'},
      {name: 'Apple', id: '1', totalCount: 1, letterCategory: 'A'},
      {name: 'Banana', id: '2', totalCount: 2, letterCategory: 'B'},
      {name: 'Cherry', id: '4', totalCount: 3, letterCategory: 'C'},
    ]);
  });

  it('sorts by total count', () => {
    const result = getFilteredFilters({
      filtersWithLetterCategory: filters,
      searchValue: '',
      letterCategory: '',
      sortBy: 'count',
    });
    expect(result).toEqual([
      {name: '1 Filter', id: '3', totalCount: 4, letterCategory: '[0-9]'},
      {name: 'Cherry', id: '4', totalCount: 3, letterCategory: 'C'},
      {name: 'Banana', id: '2', totalCount: 2, letterCategory: 'B'},
      {name: 'Apple', id: '1', totalCount: 1, letterCategory: 'A'},
    ]);
  });

  it('filters by search value and letter category, and sorts by total count', () => {
    const result = getFilteredFilters({
      filtersWithLetterCategory: filters,
      searchValue: 'a',
      letterCategory: 'B',
      sortBy: 'count',
    });
    expect(result).toEqual([
      {name: 'Banana', id: '2', totalCount: 2, letterCategory: 'B'},
    ]);
  });
});
