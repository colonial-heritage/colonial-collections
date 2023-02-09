import {SearchResult} from '@/lib/dataset-fetcher';

interface SearchDatasets {
  licenses: string[];
  publishers: string[];
  query?: string;
  offset: number;
  sortOrder: string;
  sortBy: string;
}

// Only use this function for client components.
// For server component use the dataset-fetcher directly.
export async function clientSearchDatasets({
  licenses,
  publishers,
  query,
  offset,
  sortBy,
  sortOrder,
}: SearchDatasets): Promise<SearchResult> {
  // Convert all values to strings, before using it in URLSearchParams.
  const searchParams = {
    query: query || '',
    licenses: licenses.join(','),
    publishers: publishers.join(','),
    offset: `${offset}`,
    sortBy,
    sortOrder,
  };

  const response = await fetch(
    '/api/datasets?' + new URLSearchParams(searchParams)
  );

  if (!response.ok) {
    throw new Error(
      'There was a problem fetching the datasets. Please reload the page to try again.'
    );
  }
  return response.json();
}
