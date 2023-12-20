'use client';

import {FacetCheckBox, FacetTitle, FacetWrapper} from './base-facet';
import {FacetVariant, SearchResultFilter} from './definitions';

interface Props {
  title: string;
  filters: SearchResultFilter[];
  filterKey: string;
  testId?: string;
  variant?: FacetVariant;
}

export function MultiSelectFacet({
  title,
  filters,
  filterKey,
  testId,
  variant,
}: Props) {
  if (!filters.length) {
    return null;
  }

  return (
    <FacetWrapper testId={testId} variant={variant}>
      <FacetTitle title={title} />
      {filters.map(searchResultFilter => (
        <FacetCheckBox
          key={searchResultFilter.id}
          filterKey={filterKey}
          name={searchResultFilter.name}
          id={searchResultFilter.id}
          count={searchResultFilter.totalCount}
        />
      ))}
    </FacetWrapper>
  );
}
