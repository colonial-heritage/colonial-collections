'use client';

import {FacetCheckBox, FacetTitle, FacetWrapper} from './base-facet';
import {SearchResultFilter} from './definitions';

interface Props {
  title: string;
  filters: SearchResultFilter[];
  filterKey: string;
  testId?: string;
}

export function MultiSelectFacet({title, filters, filterKey, testId}: Props) {
  if (!filters.length) {
    return null;
  }

  return (
    <FacetWrapper testId={testId} title={title}>
      <FacetTitle />
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
