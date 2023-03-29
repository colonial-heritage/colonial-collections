import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {useLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import ClientFilters from './client-filters';
import DatasetList from './dataset-list';
import {
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  SearchParams,
} from '@/lib/search-params';

interface Props {
  searchParams?: SearchParams;
}
export default async function Home({searchParams}: Props) {
  const searchOptions = fromSearchParamsToSearchOptions(searchParams ?? {});
  const sortBy = getClientSortBy({
    sortBy: searchOptions.sortBy,
    sortOrder: searchOptions.sortOrder,
  });

  let hasError, searchResult;
  try {
    searchResult = await datasetFetcher.search(searchOptions);
  } catch (error) {
    hasError = true;
    console.error(error);
  }
  const locale = useLocale();
  const messages = (await import(`@/messages/${locale}/messages.json`)).default;
  const t = await getTranslations('Home');

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <NextIntlClientProvider
        locale={locale}
        messages={{
          Home: messages.Home,
          Paginator: messages.Paginator,
        }}
      >
        {hasError && (
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 lg:col-span-3 xl:col-span-4"
            role="alert"
            data-testid="fetch-error"
          >
            <p>{t('fetchError')}</p>
          </div>
        )}

        {searchResult && (
          <ClientFilters
            searchOptions={searchOptions}
            sortBy={sortBy}
            filters={searchResult.filters}
            limit={searchResult.limit}
            totalCount={searchResult.totalCount}
          >
            <DatasetList
              datasets={searchResult.datasets}
              totalCount={searchResult.totalCount}
            />
          </ClientFilters>
        )}
      </NextIntlClientProvider>
    </div>
  );
}
