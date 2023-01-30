import ClientPage from './client-page';
import {DatasetFetcher} from '@/lib/dataset-fetcher';

const datasetFetcher = new DatasetFetcher({
  endpointUrl: process.env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
});

export default async function Home() {
  const initialDatasets = await datasetFetcher.search();

  return (
    <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        <ClientPage initialDatasets={initialDatasets} />
      </div>
    </main>
  );
}
