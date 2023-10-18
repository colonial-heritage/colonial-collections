import personFetcher from '@/lib/person-fetcher-instance';
import {useLocale, useTranslations} from 'next-intl';
import {getTranslator} from 'next-intl/server';
import PersonList from './person-list';
import {sortMapping} from './sort-mapping';
import {
  ClientListStore,
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  defaultSortBy,
  Type as SearchParamType,
} from '@colonial-collections/list-store';
import {
  SearchResult,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '@/lib/api/persons';
import {
  FilterSet,
  Paginator,
  SelectedFilters,
  SearchFieldWithLabel,
  OrderSelector,
} from 'ui/list';
import {
  PageTitle,
  PageHeader,
  SmallScreenSubMenu,
  SubMenuButton,
  SubMenuDialog,
} from 'ui';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import Tabs from '../tabs';
import {ElementType} from 'react';

// Revalidate the page every n seconds
export const revalidate = 60;

interface FacetProps {
  name: keyof SearchResult['filters'];
  searchParamType: SearchParamType;
  Component: ElementType;
}

const facets: ReadonlyArray<FacetProps> = [
  {name: 'birthYears', searchParamType: 'array', Component: FilterSet},
  {name: 'birthPlaces', searchParamType: 'array', Component: FilterSet},
  {name: 'deathYears', searchParamType: 'array', Component: FilterSet},
  {name: 'deathPlaces', searchParamType: 'array', Component: FilterSet},
];

interface FacetMenuProps {
  filters: SearchResult['filters'];
}

function FacetMenu({filters}: FacetMenuProps) {
  const t = useTranslations('Filters');

  return (
    <>
      <SearchFieldWithLabel />
      {facets.map(
        ({name, Component}) =>
          !!filters[name]?.length && (
            <Component
              key={name}
              title={t(`${name}Filter`)}
              searchResultFilters={filters[name]}
              filterKey={name}
              testId={`${name}Filter`}
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
    filterKeys: facets.map(({name, searchParamType}) => ({
      name,
      type: searchParamType,
    })),
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
    searchResult = await personFetcher.search(searchOptions);
  } catch (err) {
    hasError = true;
    console.error(err);
  }

  const locale = useLocale();
  const t = await getTranslator(locale, 'Persons');

  return (
    <>
      <Tabs />
      <div className="flex flex-col md:flex-row gap-6">
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
                baseUrl: '/persons',
                defaultSortBy,
              }}
            />
            <aside
              id="facets"
              className="hidden md:flex w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2"
            >
              <FacetMenu filters={searchResult.filters} />
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
                  <FacetMenu filters={searchResult.filters} />
                </SubMenuDialog>
              </SmallScreenSubMenu>
              <PageHeader>
                <div
                  className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap"
                  id="search-results"
                >
                  <div className="ml-4 mt-2">
                    <PageTitle>
                      {t('title', {totalPersons: searchResult.totalCount})}
                    </PageTitle>
                  </div>
                  <div>
                    <OrderSelector />
                  </div>
                </div>
                <SelectedFilters
                  filters={facets.map(filterKey => ({
                    searchResultFilters:
                      searchResult!.filters[filterKey.name] ?? [],
                    filterKey: filterKey.name,
                  }))}
                />
              </PageHeader>

              <PersonList
                persons={searchResult.persons}
                totalCount={searchResult.totalCount}
              />
              <Paginator />
            </section>
          </>
        )}
      </div>
    </>
  );
}
