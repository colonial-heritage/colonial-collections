import type {SearchResultFilter} from '../definitions';
import type {RawBucket} from './searcher';

function toMatchedFilter(bucket: RawBucket): SearchResultFilter {
  const totalCount = bucket.doc_count; // Actual count if a filter matched the query
  const id = bucket.key;
  const name = bucket.key; // Replace with labelFetcher as soon as we have IRIs

  return {totalCount, id, name};
}

export function buildFilters(rawMatchedFilters: RawBucket[]) {
  const matchedFilters = rawMatchedFilters.map(rawMatchedFilter => {
    return toMatchedFilter(rawMatchedFilter);
  });

  // TBD: sort filters by totalCount, descending + subsort by totalCount, ascending?

  return matchedFilters;
}
