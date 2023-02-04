import {RawBucket, SearchResultFilter} from './dataset-fetcher';

function toUnmatchedFilter(bucket: RawBucket): SearchResultFilter {
  const totalCount = 0; // Initial count; will be overridden by the matching filter, if any
  const [id, name] = bucket.key;
  return {totalCount, id, name};
}

function toMatchedFilter(bucket: RawBucket): SearchResultFilter {
  const totalCount = bucket.doc_count; // Actual count if a filter matched the query
  const [id, name] = bucket.key;
  return {totalCount, id, name};
}

function combineUnmatchedWithMatchedFilters(
  unmatchedFilters: SearchResultFilter[],
  matchedFilters: SearchResultFilter[]
) {
  const combinedFilters = unmatchedFilters.map(filter => {
    const matchedFilter = matchedFilters.find(
      matchedFilter => matchedFilter.id === filter.id
    );
    return matchedFilter !== undefined ? matchedFilter : filter;
  });

  return combinedFilters;
}

export function buildFilters(
  rawUnmatchedFilters: RawBucket[],
  rawMatchedFilters: RawBucket[]
) {
  const unmatchedFilters = rawUnmatchedFilters.map(toUnmatchedFilter);
  const matchedFilters = rawMatchedFilters.map(toMatchedFilter);
  const combinedFilters = combineUnmatchedWithMatchedFilters(
    unmatchedFilters,
    matchedFilters
  );

  // TODO: sort by totalCount, descending + subsort by totalCount, ascending

  return combinedFilters;
}
