import heritageObjectFetcher from '@/lib/heritage-object-fetcher-instance';
import {useLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import ClientFilters from './client-filters';
import HeritageObjectList from './heritage-object-list';
import {
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  SearchParams,
} from '@/lib/search-params';
import {ClientListStore} from '@colonial-collections/list-store';
import {SearchResult} from '@/lib/heritage-fetcher';

// Set the order of the filters
const filterKeysOrder: ReadonlyArray<keyof SearchResult['filters']> = [
  'owners',
  'types',
  'subjects',
];

interface Props {
  searchParams?: SearchParams;
}

// Revalidate the page
export const revalidate = 0;

export default async function Home({searchParams}: Props) {
  const searchOptions = fromSearchParamsToSearchOptions(searchParams ?? {});
  const sortBy = getClientSortBy({
    sortBy: searchOptions.sortBy,
    sortOrder: searchOptions.sortOrder,
  });

  let hasError, searchResult;
  try {
    searchResult = await heritageObjectFetcher.search(searchOptions);
  } catch (error) {
    hasError = true;
    console.error(error);
  }
  const locale = useLocale();
  const messages = (await import(`@/messages/${locale}/messages.json`)).default;
  const t = await getTranslations('Home');

  return (
    <div className="flex flex-col md:flex-row gap-6">
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
          <>
            <ClientListStore
              {...{
                totalCount: searchResult.totalCount,
                offset: searchResult.offset,
                limit: searchResult.limit,
                query: searchOptions.query ?? '',
                sortBy,
                selectedFilters: searchOptions.filters,
              }}
            />
            <ClientFilters
              filters={searchResult.filters}
              filterKeysOrder={filterKeysOrder}
            >
              <HeritageObjectList
                heritageObjects={searchResult.heritageObjects}
                totalCount={searchResult.totalCount}
              />
            </ClientFilters>
          </>
        )}
      </NextIntlClientProvider>
    </div>
  );
}
