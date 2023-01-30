import {DatasetFetcher} from '@/lib/dataset-fetcher';
import {useLocale} from 'next-intl';
import DatasetList from './dataset-list';

const datasetFetcher = new DatasetFetcher({
  endpointUrl: process.env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
});

export default async function Home() {
  const initialSearchResult = await datasetFetcher.search();
  const locale = useLocale();

  return (
    <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        <DatasetList
          initialSearchResult={initialSearchResult}
          locale={locale}
        />
      </div>
    </main>
  );
}
