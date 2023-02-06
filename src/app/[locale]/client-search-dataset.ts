import {SearchOptions, SearchResult} from '@/lib/dataset-fetcher';

interface SearchDatasets {
  licenses: string[];
  publishers: string[];
}

// Only use this function for client components.
// For server component use the dataset-fetcher directly.
export async function clientSearchDatasets({
  licenses,
  publishers,
}: SearchDatasets): Promise<SearchResult> {
  const options: SearchOptions = {
    filters: {publishers, licenses},
  };
  const response = await fetch('/api/dataset-search', {
    method: 'POST',
    body: JSON.stringify(options),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
