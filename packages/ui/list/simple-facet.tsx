import {FacetCheckBox, FacetTitle, FacetWrapper} from './base-facet';
import {SearchResultFilter} from './SearchResultFilter';

interface Props {
  title: string;
  filters: SearchResultFilter[];
  filterKey: string;
  testId?: string;
}

export function SimpleFacet({title, filters, filterKey, testId}: Props) {
  if (!filters.length) return null;

  return (
    <FacetWrapper testId={testId}>
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
