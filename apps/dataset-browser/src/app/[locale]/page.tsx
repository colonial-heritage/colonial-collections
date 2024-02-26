import datasets from '@/lib/datasets-instance';
import {
  DatasetSearchResult,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '@colonial-collections/api';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import DatasetList from './dataset-list';
import {sortMapping} from './sort-mapping';
import {
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  Type as SearchParamType,
} from '@colonial-collections/list-store';
import {
  Paginator,
  SelectedFilters,
  SearchFieldWithLabel,
  OrderSelector,
  MultiSelectFacet,
} from '@colonial-collections/ui/list';
import {
  PageTitle,
  PageHeader,
  SmallScreenSubMenu,
  SubMenuButton,
  SubMenuDialog,
} from '@colonial-collections/ui';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import {ElementType} from 'react';
import {ListStoreUpdater} from './list-store-updater';

// Revalidate the page every n seconds
export const revalidate = 60;

interface FacetProps {
  name: keyof DatasetSearchResult['filters'];
  searchParamType: SearchParamType;
  Component: ElementType;
}

const facets: ReadonlyArray<FacetProps> = [
  {
    name: 'publishers',
    searchParamType: 'array',
    Component: MultiSelectFacet,
  },
  {
    name: 'licenses',
    searchParamType: 'array',
    Component: MultiSelectFacet,
  },
];

interface FacetMenuProps {
  filters: DatasetSearchResult['filters'];
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
      defaultSortOrder: SortOrder.Ascending,
      SortByEnum,
      defaultSortBy: SortBy.Name,
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
  let searchResult: DatasetSearchResult | undefined;
  try {
    searchResult = await datasets.search(searchOptions);
  } catch (err) {
    hasError = true;
    console.error(err);
  }

  const t = await getTranslations('Home');

  return (
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
            className="hidden md:flex w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2 pr-5"
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
                    {t('title', {totalDatasets: searchResult.totalCount})}
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

            <DatasetList
              datasets={searchResult.datasets}
              totalCount={searchResult.totalCount}
            />
            <Paginator />
          </section>
        </>
      )}
    </div>
  );
}
