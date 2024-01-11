import personFetcher from '@/lib/person-fetcher-instance';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import PersonList from './person-list';
import {sortMapping} from './sort-mapping';
import {
  fromSearchParamsToSearchOptions,
  getClientSortBy,
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
  Paginator,
  SelectedFilters,
  SearchFieldWithLabel,
  OrderSelector,
  SearchableMultiSelectFacet,
} from '@colonial-collections/ui/list';
import {
  PageTitle,
  PageHeader,
  SmallScreenSubMenu,
  SubMenuButton,
  SubMenuDialog,
} from '@colonial-collections/ui';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import Tabs from '@/components/tabs';
import {ElementType} from 'react';
import {ListStoreUpdater} from '@/components/list-store-updater';

// Revalidate the page every n seconds
export const revalidate = 60;

interface FacetProps {
  name: keyof SearchResult['filters'];
  searchParamType: SearchParamType;
  Component: ElementType;
}

const facets: ReadonlyArray<FacetProps> = [
  {
    name: 'birthYears',
    searchParamType: 'array',
    Component: SearchableMultiSelectFacet,
  },
  {
    name: 'birthPlaces',
    searchParamType: 'array',
    Component: SearchableMultiSelectFacet,
  },
  {
    name: 'deathYears',
    searchParamType: 'array',
    Component: SearchableMultiSelectFacet,
  },
  {
    name: 'deathPlaces',
    searchParamType: 'array',
    Component: SearchableMultiSelectFacet,
  },
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
              filters={filters[name]}
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

  const t = await getTranslations('Constituents');

  return (
    <>
      <div className="bg-consortiumBlue-800 text-white flex flex-col gap-8 pt-9 pb-40">
        <div className="max-w-[1800px] mx-auto w-full">
          <Tabs />
          <div className="mb-4 mx-4 sd:mx-10 flex flex-col md:flex-row gap-6">
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
                <ListStoreUpdater
                  {...{
                    totalCount: searchResult.totalCount,
                    offset: searchResult.offset,
                    limit: searchResult.limit,
                    query: searchOptions.query ?? '',
                    sortBy,
                    selectedFilters: searchOptions.filters,
                  }}
                />
                <aside
                  id="facets"
                  className="mb-4 md:mx-10 hidden md:flex w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap"
                >
                  <FacetMenu filters={searchResult.filters} />
                </aside>

                <section className="mb-4 md:mx-10 w-full md:w-2/3 gap-6 flex flex-col">
                  <div>
                    <SmallScreenSubMenu>
                      <SubMenuButton className="md:hidden py-2 px-3 rounded-full bg-consortiumGreen-300 text-consortiumBlue-800 transition flex items-center gap-1 text-sm my-2">
                        <AdjustmentsHorizontalIcon
                          className="ml-1 h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{t('filters')}</span>
                      </SubMenuButton>
                      <SubMenuDialog title={t('filters')}>
                        <FacetMenu filters={searchResult.filters} />
                      </SubMenuDialog>
                    </SmallScreenSubMenu>
                  </div>
                  <PageHeader>
                    <div
                      className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap"
                      id="search-results"
                    >
                      <div className="ml-4 mt-2">
                        <PageTitle>
                          {t('title', {
                            constituentsTotalCount: searchResult.totalCount,
                          })}
                        </PageTitle>
                      </div>
                      <div>
                        <OrderSelector />
                      </div>
                    </div>
                    <SelectedFilters
                      filters={searchResult.filters}
                      filterSettings={facets}
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
        </div>
      </div>
    </>
  );
}
