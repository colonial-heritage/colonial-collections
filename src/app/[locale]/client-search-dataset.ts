import {SearchResult} from '@/lib/dataset-fetcher';
import {Sort} from './dataset-list';

interface SearchDatasets {
  licenses: string[];
  publishers: string[];
  query?: string;
  offset: number;
  sort: Sort;
  fetchErrorText: string;
}

// Only use this function for client components.
// For server component use the dataset-fetcher directly.
export async function clientSearchDatasets({
  licenses,
  publishers,
  query,
  offset,
  sort,
  fetchErrorText,
}: SearchDatasets): Promise<SearchResult> {
  // Convert all values to strings, before using it in URLSearchParams.
  const searchParams = {
    query: query || '',
    licenses: licenses.join(','),
    publishers: publishers.join(','),
    offset: `${offset}`,
    sort,
  };

  const response = await fetch(
    '/api/datasets?' + new URLSearchParams(searchParams)
  );

  if (!response.ok) {
    throw new Error(fetchErrorText);
  }
  return response.json();
}
