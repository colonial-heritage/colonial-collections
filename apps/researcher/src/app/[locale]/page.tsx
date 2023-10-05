import heritageObjects from '@/lib/heritage-objects-instance';
import {useLocale, useTranslations} from 'next-intl';
import {getTranslator} from 'next-intl/server';
import HeritageObjectList from './(objects)/heritage-object-list';
import {sortMapping} from './(objects)/sort-mapping';
import {
  ClientListStore,
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  defaultSortBy,
} from '@colonial-collections/list-store';
import {
  SearchResult,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '@/lib/api/objects';
import {
  FilterSet,
  Paginator,
  SelectedFilters,
  SearchFieldWithLabel,
  OrderSelector,
} from 'ui/list';
import {SmallScreenSubMenu, SubMenuButton, SubMenuDialog} from 'ui';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import Tabs from './tabs';

// Revalidate the page every n seconds
export const revalidate = 60;

// Set the order of the filters
const filterKeysOrder: ReadonlyArray<keyof SearchResult['filters']> = [
  'creators',
  'types',
  'subjects',
];

interface FacetMenuProps {
  filters: SearchResult['filters'];
  filterKeysOrder: ReadonlyArray<keyof SearchResult['filters']>;
}

function FacetMenu({filterKeysOrder, filters}: FacetMenuProps) {
  const t = useTranslations('Filters');

  return (
    <>
      <SearchFieldWithLabel />
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
    searchResult = await heritageObjects.search(searchOptions);
  } catch (error) {
    hasError = true;
    console.error(error);
  }

  const locale = useLocale();
  const t = await getTranslator(locale, 'Home');

  return (
    <>
      <Tabs />
      <div className="flex flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full mx-auto px-10">
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
                defaultSortBy,
              }}
            />
            <aside
              id="facets"
              className="hidden md:block w-full md:w-1/3 lg:w-1/5 order-2 md:order-1"
            >
              <FacetMenu
                filters={searchResult.filters}
                filterKeysOrder={filterKeysOrder}
              />
            </aside>

            <main className="w-full md:w-2/3 lg:w-4/5  order-2 md:order-1">
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
              <div
                className="flex flex-col sm:flex-row sm:justify-between"
                id="search-results"
              >
                <h2 className="text-xl">
                  {t('title', {totalDatasets: searchResult.totalCount})}
                </h2>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <OrderSelector />
                </div>
              </div>
              <SelectedFilters
                filters={filterKeysOrder.map(filterKey => ({
                  searchResultFilters: searchResult!.filters[filterKey] ?? [],
                  filterKey,
                }))}
              />
              <HeritageObjectList
                heritageObjects={searchResult.heritageObjects}
                totalCount={searchResult.totalCount}
              />
              <Paginator />
            </main>
          </>
        )}
      </div>
    </>
  );
}
