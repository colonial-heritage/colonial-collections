import heritageObjects from '@/lib/heritage-objects-instance';
import {getTranslations} from 'next-intl/server';
import HeritageObjectList from './heritage-object-list';
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
} from '@/lib/api/objects';
import {
  MultiSelectFacet,
  SearchableMultiSelectFacet,
  Paginator,
  SelectedFilters,
  SearchFieldWithLabel,
  OrderSelector,
  DateRangeFacet,
} from '@colonial-collections/ui/list';
import {
  SmallScreenSubMenu,
  SubMenuButton,
  SubMenuDialog,
} from '@colonial-collections/ui';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/20/solid';
import {ElementType} from 'react';
import {ListStoreUpdater} from '@/components/list-store-updater';
import {redirect} from '@/navigation';

// Revalidate the page every n seconds
export const revalidate = 60;

interface FilterSetting {
  name: keyof SearchResult['filters'];
  searchParamType: SearchParamType;
}

const filterSettings: ReadonlyArray<FilterSetting> = [
  {name: 'locations', searchParamType: 'array'},
  {name: 'types', searchParamType: 'array'},
  {name: 'subjects', searchParamType: 'array'},
  {name: 'publishers', searchParamType: 'array'},
  {name: 'materials', searchParamType: 'array'},
  {name: 'creators', searchParamType: 'array'},
  {name: 'dateCreatedStart', searchParamType: 'number'},
  {name: 'dateCreatedEnd', searchParamType: 'number'},
];

interface Facet {
  name: string;
  // `Component` needs to be uppercase to be valid JSX
  Component: ElementType;
}

interface DateRangeFacet extends Facet {
  startDateKey: string;
  endDateKey: string;
}

const facets: ReadonlyArray<Facet | DateRangeFacet> = [
  {name: 'locations', Component: SearchableMultiSelectFacet},
  {
    name: 'dateCreated',
    Component: DateRangeFacet,
    startDateKey: 'dateCreatedStart',
    endDateKey: 'dateCreatedEnd',
  },
  {name: 'types', Component: SearchableMultiSelectFacet},
  {name: 'subjects', Component: MultiSelectFacet},
  {name: 'materials', Component: SearchableMultiSelectFacet},
  {name: 'creators', Component: SearchableMultiSelectFacet},
  {name: 'publishers', Component: MultiSelectFacet},
];

interface FacetMenuProps {
  filters: SearchResult['filters'];
}

async function FacetMenu({filters}: FacetMenuProps) {
  const t = await getTranslations('Filters');

  return (
    <div className="w-full flex flex-col gap-6">
      <SearchFieldWithLabel />
      {facets.map(({name, Component, ...customProps}) => {
        const facetProps = Object.keys(customProps).length
          ? customProps
          : {
              filters: filters[name as keyof SearchResult['filters']],
              filterKey: name,
            };

        return (
          <Component
            key={name}
            title={t(`${name}Filter`)}
            testId={`${name}Filter`}
            {...facetProps}
          />
        );
      })}
    </div>
  );
}

interface Props {
  searchParams?: {[filter: string]: string};
}

export default async function SearchResults({searchParams = {}}: Props) {
  if (!searchParams.query) {
    redirect('/');
  }

  const searchOptions = fromSearchParamsToSearchOptions({
    sortOptions: {
      SortOrderEnum,
      defaultSortOrder: SortOrder.Descending,
      SortByEnum,
      defaultSortBy: SortBy.Relevance,
      sortMapping: sortMapping,
    },
    filterKeys: filterSettings.map(({name, searchParamType}) => ({
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
    searchResult = await heritageObjects.search(searchOptions);
  } catch (err) {
    hasError = true;
    console.error(err);
  }

  const t = await getTranslations('ObjectSearchResults');

  return (
    <>
      <div className="bg-consortiumBlue-800 text-white flex flex-col gap-8 pb-40 mt-8">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="flex flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full mx-auto px-10 ">
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
                  className="hidden md:block w-full md:w-1/3 lg:w-1/5 order-2 md:order-1"
                >
                  <FacetMenu filters={searchResult.filters} />
                </aside>

                <main className="w-full md:w-2/3 lg:w-4/5 order-2 md:order-1">
                  <SmallScreenSubMenu>
                    <SubMenuButton className="md:hidden py-2 px-3 rounded-full bg-consortiumGreen-300 text-consortiumBlue-800 transition flex items-center gap-1 text-sm my-2">
                      <AdjustmentsHorizontalIcon
                        className="ml-1 h-4 w-4 flex-shrink-0 text-consortiumBlue-800"
                        aria-hidden="true"
                      />
                      <span>{t('filters')}</span>
                    </SubMenuButton>
                    <SubMenuDialog title={t('filters')}>
                      <FacetMenu filters={searchResult.filters} />
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
                    filters={searchResult.filters}
                    filterSettings={filterSettings}
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
        </div>
      </div>
    </>
  );
}
