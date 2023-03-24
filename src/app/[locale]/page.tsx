import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {useLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import ClientFilters from './client-filters';
import DatasetList, {Sort, defaultSort} from './dataset-list';
import {
  SearchOptions,
  SearchResult,
  SortBy,
  SortOrder,
} from '@/lib/dataset-fetcher';

const sortMapping = {
  [Sort.RelevanceDesc]: {
    sortBy: SortBy.Relevance,
    sortOrder: SortOrder.Descending,
  },
  [Sort.NameAsc]: {
    sortBy: SortBy.Name,
    sortOrder: SortOrder.Ascending,
  },
  [Sort.NameDesc]: {
    sortBy: SortBy.Name,
    sortOrder: SortOrder.Descending,
  },
};

interface Props {
  searchParams?: {
    publishers?: string;
    licenses?: string;
    query?: string;
    offset?: string;
    sort?: Sort;
  };
}

interface ErrorResponse {
  hasError: true;
  errorMessage: string;
  searchResult: null;
}
interface SearchResultResponse {
  hasError: false;
  searchResult: SearchResult;
}
type Response = ErrorResponse | SearchResultResponse;

async function getData({searchParams = {}}: Props): Promise<Response> {
  const {
    publishers,
    licenses,
    query,
    offset = '0',
    sort = defaultSort,
  } = searchParams;

  const {sortBy, sortOrder} = sortMapping[sort] || {};

  // Transform the string values from the query string to SearchOptions
  const options = {
    offset: +offset,
    filters: {
      publishers: publishers?.split(',').filter(id => !!id),
      licenses: licenses?.split(',').filter(id => !!id),
    },
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  if (!options.sortBy || !options.sortOrder || isNaN(options.offset)) {
    return {
      hasError: true,
      errorMessage: 'Invalid options',
      searchResult: null,
    };
  }

  const validOptions: SearchOptions = options;

  // Only add a search query if provided
  if (query) {
    validOptions.query = query;
  }

  try {
    const searchResult = await datasetFetcher.search(validOptions);
    return {searchResult, hasError: false};
  } catch (error) {
    return {hasError: true, errorMessage: 'Fetch error', searchResult: null};
  }
}

export default async function Home({searchParams}: Props) {
  const {searchResult, hasError} = await getData({searchParams});
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
        {hasError ? (
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 lg:col-span-3 xl:col-span-4"
            role="alert"
            data-testid="fetch-error"
          >
            <p>{t('fetchError')}</p>
          </div>
        ) : (
          <ClientFilters
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
