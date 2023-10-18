'use client';

import {createStore, useStore} from 'zustand';
import {useMemo, useRef, createContext, useContext} from 'react';

export type FacetSortBy = 'alphabetical' | 'count';

export interface Filter {
  name?: string | number;
  id: string | number;
  totalCount: number;
}

export interface SearchableFilter extends Filter {
  letterCategory: string;
  name: string;
}

interface FacetProps {
  searchValue: string;
  letterCategory: string;
  sortBy: FacetSortBy;
  filters: Filter[];
}

interface FacetState extends FacetProps {
  setSearchValue: (value: string) => void;
  toggleLetterCategory: (value: string) => void;
  setSortBy: (value: FacetSortBy) => void;
  setFilters: (value: Filter[]) => void;
}

type FacetStore = ReturnType<typeof createFacetStore>;

export const initialState = {
  searchValue: '',
  letterCategory: '',
  sortBy: 'count' as FacetSortBy,
  filters: [],
};

export const createFacetStore = (initProps?: Partial<FacetProps>) => {
  return createStore<FacetState>()(set => ({
    ...initialState,
    ...initProps,
    setSearchValue: (searchValue: string) =>
      set(() => ({
        searchValue,
      })),
    toggleLetterCategory: (category: string) =>
      set(state => ({
        letterCategory: state.letterCategory === category ? '' : category,
      })),
    setSortBy: (sortBy: FacetSortBy) =>
      set(() => ({
        sortBy,
      })),
    setFilters: (filters: Filter[]) =>
      set(() => ({
        filters,
      })),
  }));
};

type FacetProviderProps = React.PropsWithChildren<Partial<FacetProps>>;

export const FacetContext = createContext<FacetStore | null>(null);

export function FacetProvider({children, ...props}: FacetProviderProps) {
  const storeRef = useRef<FacetStore>();
  if (!storeRef.current) {
    storeRef.current = createFacetStore(props);
  }
  return (
    <FacetContext.Provider value={storeRef.current}>
      {children}
    </FacetContext.Provider>
  );
}

export function getLetterCategories(filters: SearchableFilter[]) {
  return [
    ...new Set(
      filters
        .map(filter => filter.letterCategory)
        .filter(category => !!category)
    ),
  ].sort();
}

export function getFiltersWithLetterCategory(filters?: Filter[]) {
  if (!filters?.length) {
    return [];
  }
  return filters.map(filter => {
    let letterCategory = '';
    const name = filter.name?.toString();
    if (name) {
      const firstLetter = name.toUpperCase().replace(/[^0-9A-Z]/g, '')[0];
      if (/^\d+$/.test(firstLetter)) {
        letterCategory = '[0-9]';
      } else {
        letterCategory = firstLetter;
      }
    }
    return {
      ...filter,
      name: name || '',
      letterCategory,
    };
  });
}

interface GetFilteredFiltersProps {
  filtersWithLetterCategory: SearchableFilter[];
  searchValue: string;
  letterCategory: string;
  sortBy: FacetSortBy;
}

export function getFilteredFilters({
  filtersWithLetterCategory,
  searchValue,
  letterCategory,
  sortBy,
}: GetFilteredFiltersProps) {
  let filtered = filtersWithLetterCategory;

  if (searchValue) {
    filtered = filtered.filter(
      filter => filter.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (letterCategory) {
    filtered = filtered.filter(
      filter => filter.letterCategory === letterCategory
    );
  }

  if (sortBy === 'alphabetical') {
    filtered = filtered.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  } else {
    filtered = filtered.sort((a, b) => {
      return b.totalCount - a.totalCount;
    });
  }

  return filtered;
}

export function useSearchableFacet() {
  const storeContext = useContext(FacetContext);
  if (!storeContext) throw new Error('Missing FacetContext in the tree');

  const store = useStore(storeContext);
  const {searchValue, letterCategory, sortBy, filters} = store;

  const filtersWithLetterCategory = useMemo(
    () => getFiltersWithLetterCategory(filters),
    [filters]
  );

  const letterCategories = useMemo(
    () => getLetterCategories(filtersWithLetterCategory),
    [filtersWithLetterCategory]
  );

  const filteredFilters = useMemo(() => {
    return getFilteredFilters({
      filtersWithLetterCategory,
      searchValue,
      letterCategory,
      sortBy,
    });
  }, [filtersWithLetterCategory, searchValue, letterCategory, sortBy]);

  return {
    ...store,
    filteredFilters,
    letterCategories,
  };
}
