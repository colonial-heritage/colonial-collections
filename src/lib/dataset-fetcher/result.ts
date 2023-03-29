import type {RawBucket, SearchResultFilter} from '.';
import {LabelFetcher} from '../label-fetcher';

function toUnmatchedFilter(
  bucket: RawBucket,
  labelFetcher: LabelFetcher
): SearchResultFilter {
  const totalCount = 0; // Initial count; will be overridden by the matching filter, if any

  let id, name;
  if (typeof bucket.key === 'string') {
    id = bucket.key;
    name = labelFetcher.getByIri({iri: id});
  } else {
    // Array
    [id, name] = bucket.key;
  }

  return {totalCount, id, name};
}

function toMatchedFilter(
  bucket: RawBucket,
  labelFetcher: LabelFetcher
): SearchResultFilter {
  const totalCount = bucket.doc_count; // Actual count if a filter matched the query

  let id, name;
  if (typeof bucket.key === 'string') {
    id = bucket.key;
    name = labelFetcher.getByIri({iri: id});
  } else {
    // Array
    [id, name] = bucket.key;
  }

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
  rawMatchedFilters: RawBucket[],
  labelFetcher: LabelFetcher
) {
  const unmatchedFilters = rawUnmatchedFilters.map(rawUnmatchedFilter => {
    return toUnmatchedFilter(rawUnmatchedFilter, labelFetcher);
  });
  const matchedFilters = rawMatchedFilters.map(rawMatchedFilter => {
    return toMatchedFilter(rawMatchedFilter, labelFetcher);
  });
  const combinedFilters = combineUnmatchedWithMatchedFilters(
    unmatchedFilters,
    matchedFilters
  );

  // TBD: sort filters by totalCount, descending + subsort by totalCount, ascending?

  return combinedFilters;
}
