import {PageWithSidebarContainer} from '@/components/page';
import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {useLocale, NextIntlClientProvider} from 'next-intl';
import ClientFilters from './client-filters';
import DatasetList, {Sort, defaultSort} from './dataset-list';
import {SearchOptions, SortBy, SortOrder} from '@/lib/dataset-fetcher';

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
  searchParams: {
    publishers?: string;
    licenses?: string;
    query?: string;
    offset?: string;
    sort?: Sort;
  };
}
async function getData({searchParams}: Props) {
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

  // TODO
  // if (!options.sortBy || !options.sortOrder || isNaN(options.offset)) {
  //   res.status(400).send({message: 'Invalid options'});
  //   return;
  // }

  const validOptions: SearchOptions = options;

  // Only add a search query if provided
  if (query) {
    validOptions.query = query;
  }

  return await datasetFetcher.search(validOptions);
}

export default async function Home({searchParams}: Props) {
  const searchResult = await getData({searchParams});
  const locale = useLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;

  // TODO;
  // if (error instanceof Error) {
  //   return (
  //     <div
  //       className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 lg:col-span-3 xl:col-span-4"
  //       role="alert"
  //       data-testid="fetch-error"
  //     >
  //       <p>{t('fetchError')}</p>
  //     </div>
  //   );
  // }

  return (
    <PageWithSidebarContainer>
      <NextIntlClientProvider
        locale={locale}
        messages={{
          Home: messages.Home,
          Paginator: messages.Paginator,
        }}
      >
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
      </NextIntlClientProvider>
    </PageWithSidebarContainer>
  );
}
