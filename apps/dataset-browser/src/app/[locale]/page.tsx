import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {useLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import DatasetList from './dataset-list';
import {sortMapping} from './sort-mapping';
import {
  ClientListStore,
  fromSearchParamsToSearchOptions,
  getClientSortBy,
} from '@colonial-collections/list-store';
import {
  SearchResult,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '@/lib/datasets';
import {
  FilterSet,
  Paginator,
  SelectedFilters,
  SearchField,
  OrderSelector,
} from 'ui/list';
import {
  PageTitle,
  PageHeader,
  SmallScreenSubMenu,
  SubMenuButton,
  SubMenuDialog,
} from 'ui';
import {useTranslations} from 'next-intl';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';

// Revalidate the page every n seconds
export const revalidate = 60;

// Set the order of the filters
const filterKeysOrder: ReadonlyArray<keyof SearchResult['filters']> = [
  'publishers',
  'spatialCoverages',
  'genres',
  'licenses',
];

interface FacetMenuProps {
  filters: SearchResult['filters'];
  filterKeysOrder: ReadonlyArray<keyof SearchResult['filters']>;
}

function FacetMenu({filterKeysOrder, filters}: FacetMenuProps) {
  const t = useTranslations('Filters');

  return (
    <>
      <SearchField />
      {filterKeysOrder.map(
        filterKey =>
          !!filters[filterKey]?.length && (
            <FilterSet
              key={filterKey}
              title={t(`${filterKey}Filter`)}
              searchResultFilters={filters[filterKey]}
              filterKey={filterKey}
              testId={`${filterKey}Filter`}
            />
          )
      )}
    </>
  );
}

interface Props {
  searchParams?: {[filter: string]: string};
}

export default async function Home({searchParams = {}}: Props) {
  const searchOptions = fromSearchParamsToSearchOptions({
    sortOptions: {
      SortOrderEnum,
      defaultSortOrder: SortOrder.Descending,
      SortByEnum,
      defaultSortBy: SortBy.Relevance,
      sortMapping: sortMapping,
    },
    searchParams,
  });
  const sortBy = getClientSortBy({
    sortMapping,
    sortPair: {
      sortBy: searchOptions.sortBy,
      sortOrder: searchOptions.sortOrder,
    },
  });

  let hasError;
  let searchResult: SearchResult | undefined;
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
    <div className="flex flex-col md:flex-row gap-6">
      <NextIntlClientProvider
        locale={locale}
        messages={{
          Home: messages.Home,
          Paginator: messages.Paginator,
          Filters: messages.Filters,
          Sort: messages.Sort,
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
                baseUrl: '/',
              }}
            />
            <aside
              id="facets"
              className="hidden md:flex w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2"
            >
              <FacetMenu
                filters={searchResult.filters}
                filterKeysOrder={filterKeysOrder}
              />
            </aside>

            <section className="w-full md:w-2/3 gap-6 flex flex-col">
              <SmallScreenSubMenu>
                <SubMenuButton className="inline-flex items-center md:hidden">
                  <span className="text-base font-medium text-gray-900">
                    {t('filters')}
                  </span>
                  <AdjustmentsHorizontalIcon
                    className="ml-1 h-5 w-5 flex-shrink-0 text-gray-900"
                    aria-hidden="true"
                  />
                </SubMenuButton>
                <SubMenuDialog title={t('filters')}>
                  <FacetMenu
                    filters={searchResult.filters}
                    filterKeysOrder={filterKeysOrder}
                  />
                </SubMenuDialog>
              </SmallScreenSubMenu>
              <PageHeader>
                <div
                  className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap"
                  id="search-results"
                >
                  <div className="ml-4 mt-2">
                    <PageTitle>
                      {t('title', {totalDatasets: searchResult.totalCount})}
                    </PageTitle>
                  </div>
                  <div>
                    <OrderSelector />
                  </div>
                </div>
                <SelectedFilters
                  filters={filterKeysOrder.map(filterKey => ({
                    searchResultFilters: searchResult!.filters[filterKey] ?? [],
                    filterKey,
                  }))}
                />
              </PageHeader>

              <DatasetList
                datasets={searchResult.datasets}
                totalCount={searchResult.totalCount}
              />
              <Paginator />
            </section>
          </>
        )}
      </NextIntlClientProvider>
    </div>
  );
}
