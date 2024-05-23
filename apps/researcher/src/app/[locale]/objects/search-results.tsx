import heritageObjects from '@/lib/heritage-objects-instance';
import {getTranslations, getLocale} from 'next-intl/server';
import HeritageObjectList from './heritage-object-list';
import {
  SortByUserOption,
  defaultSortByUserOption,
  sortMapping,
} from './sort-mapping';
import {
  fromSearchParamsToSearchOptions,
  getClientSortBy,
  ImageFetchMode,
  ListView,
  Type as SearchParamType,
} from '@colonial-collections/list-store';
import {
  HeritageObjectSearchResult,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '@colonial-collections/api';
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
import {LocaleEnum} from '@/definitions';
import {SettingsButton} from '@/components/buttons';
import SettingsMenu from './settings-menu';

// Revalidate the page every n seconds
export const revalidate = 60;

interface FilterSetting {
  name: keyof HeritageObjectSearchResult['filters'];
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
  filters: HeritageObjectSearchResult['filters'];
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
              filters:
                filters[name as keyof HeritageObjectSearchResult['filters']],
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
  const locale = (await getLocale()) as LocaleEnum;

  const searchOptions = fromSearchParamsToSearchOptions({
    sortOptions: {
      SortOrderEnum,
      defaultSortOrder: SortOrder.Descending,
      SortByEnum,
      defaultSortBy: SortBy.DateCreated,
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
  let searchResult: HeritageObjectSearchResult | undefined;
  try {
    searchResult = await heritageObjects.search({...searchOptions, locale});
  } catch (err) {
    hasError = true;
    console.error(err);
  }

  const t = await getTranslations('ObjectSearchResults');

  return (
    <>
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
              baseUrl: '/objects',
              defaultSortBy: defaultSortByUserOption,
              view: searchParams.view as ListView,
              imageFetchMode: searchParams.imageFetchMode as ImageFetchMode,
            }}
          />
          <aside
            id="facets"
            className="hidden md:block w-full md:w-1/3 lg:w-1/5 order-2 md:order-1"
          >
            <FacetMenu filters={searchResult.filters} />
          </aside>

          <main
            className="w-full md:w-2/3 lg:w-4/5 order-2 md:order-1"
            id="search-results"
          >
            <SmallScreenSubMenu>
              <SubMenuButton className="md:hidden py-2 px-3 rounded-full bg-consortium-green-300 text-consortium-blue-800 transition flex items-center gap-1 text-sm my-2">
                <AdjustmentsHorizontalIcon
                  className="ml-1 h-4 w-4 flex-shrink-0 text-consortium-blue-800"
                  aria-hidden="true"
                />
                <span>{t('filters')}</span>
              </SubMenuButton>
              <SubMenuDialog title={t('filters')}>
                <FacetMenu filters={searchResult.filters} />
              </SubMenuDialog>
            </SmallScreenSubMenu>
            <SelectedFilters
              filters={searchResult.filters}
              filterSettings={filterSettings}
            />
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mt-4">
              <h2 className="text-xl">
                {t('title', {totalDatasets: searchResult.totalCount})}
              </h2>
              <div className="flex flex-col sm:flex-row justify-end gap-4 relative flex-wrap">
                <SettingsButton>{t('addObjectsToList')}</SettingsButton>
                <SettingsMenu />
                <OrderSelector
                  values={[
                    SortByUserOption.DateCreatedDesc,
                    SortByUserOption.DateCreatedAsc,
                    SortByUserOption.NameDesc,
                    SortByUserOption.NameAsc,
                  ]}
                />
              </div>
            </div>
            <HeritageObjectList
              heritageObjects={searchResult.heritageObjects}
              totalCount={searchResult.totalCount}
            />
            <Paginator />
          </main>
        </>
      )}
    </>
  );
}
