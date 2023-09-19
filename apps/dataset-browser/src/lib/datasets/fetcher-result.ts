import type {RawBucket, SearchResultFilter} from '.';
import type {LabelFetcher} from '@colonial-collections/label-fetcher';

function toUnmatchedFilter(bucket: RawBucket): SearchResultFilter {
  const totalCount = 0; // Initial count; will be overridden by the matching filter, if any
  const id = bucket.key;
  const name = bucket.key;

  return {totalCount, id, name};
}

function toMatchedFilter(bucket: RawBucket): SearchResultFilter {
  const totalCount = bucket.doc_count; // Actual count if a filter matched the query
  const id = bucket.key;
  const name = bucket.key;

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
    return matchedFilter ?? filter;
  });

  return combinedFilters;
}

export function buildFilters(
  rawUnmatchedFilters: RawBucket[],
  rawMatchedFilters: RawBucket[]
) {
  const unmatchedFilters = rawUnmatchedFilters.map(rawUnmatchedFilter => {
    return toUnmatchedFilter(rawUnmatchedFilter);
  });
  const matchedFilters = rawMatchedFilters.map(rawMatchedFilter => {
    return toMatchedFilter(rawMatchedFilter);
  });
  const combinedFilters = combineUnmatchedWithMatchedFilters(
    unmatchedFilters,
    matchedFilters
  );

  // TBD: sort filters by totalCount, descending + subsort by totalCount, ascending?

  return combinedFilters;
}
