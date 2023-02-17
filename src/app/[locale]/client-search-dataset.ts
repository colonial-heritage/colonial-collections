import {SearchResult} from '@/lib/dataset-fetcher';
import {Sort, defaultSort} from './dataset-list';

interface Props {
  licenses: string[];
  publishers: string[];
  query?: string;
  offset: number;
  sort: Sort;
}

// Only use this function for client components.
// For server component use the dataset-fetcher directly.
export async function clientSearchDatasets({
  licenses,
  publishers,
  query,
  offset,
  sort,
}: Props): Promise<SearchResult> {
  const searchParams: {[key: string]: string} = {};

  // Convert all values to strings, before using it in URLSearchParams.
  // And only add to searchParams if needed.
  if (query) {
    searchParams.query = query;
  }

  if (licenses.length) {
    searchParams.licenses = licenses.join(',');
  }

  if (publishers.length) {
    searchParams.publishers = publishers.join(',');
  }

  if (offset) {
    searchParams.offset = `${offset}`;
  }

  if (sort !== defaultSort) {
    searchParams.sort = sort;
  }

  const response = await fetch(
    '/api/datasets?' + new URLSearchParams(searchParams)
  );

  if (!response.ok) {
    throw new Error('There was a problem fetching the datasets.');
  }
  return response.json();
}
