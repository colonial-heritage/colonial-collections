'use client';

import {useTranslations} from 'next-intl';
import {Badge} from '../badge';
import {
  useListStore,
  Type as SearchParamType,
} from '@colonial-collections/list-store';
import {SearchResultFilter} from './definitions';
import {useMemo} from 'react';
import {MagnifyingGlassIcon, TagIcon} from '@heroicons/react/24/solid';

interface SelectedFiltersForKeyProps {
  filters: SearchResultFilter[];
  searchParamType: SearchParamType;
  filterKey: string;
}

export function SelectedFiltersForKey({
  filters,
  filterKey,
  searchParamType,
}: SelectedFiltersForKeyProps) {
  const selectedFilters = useListStore(s => s.selectedFilters);
  const filterChange = useListStore(s => s.filterChange);
  const selectedFilter = selectedFilters[filterKey];

  const badges = useMemo(() => {
    function clearSelectedArrayFilter({
      id,
      filterKey,
    }: ClearSelectedFilterProps) {
      const selectedFilterForKey = selectedFilters[filterKey];
      if (!Array.isArray(selectedFilterForKey)) {
        throw new Error(
          `Selected filter for key ${filterKey} is not an array.`
        );
      }
      filterChange(
        filterKey,
        selectedFilterForKey?.filter(
          (filterId: string | number) => id !== filterId
        ) || []
      );
    }

    function clearSelectedNumberFilter(filterKey: string) {
      filterChange(filterKey, undefined);
    }

    const badges = [];
    if (searchParamType === 'number' && selectedFilter !== undefined) {
      badges.push({
        key: `${filterKey}-${selectedFilter}`,
        label: selectedFilter.toString(),
        action: () => clearSelectedNumberFilter(filterKey),
      });
    } else if (searchParamType === 'array' && selectedFilter) {
      (selectedFilter as string[]).forEach(id => {
        badges.push({
          key: `${filterKey}-${id}`,
          label: filters.find(({id: i}) => i === id)?.name ?? id,
          action: () => clearSelectedArrayFilter({id, filterKey}),
        });
      });
    }
    return badges;
  }, [
    filterChange,
    filterKey,
    filters,
    searchParamType,
    selectedFilter,
    selectedFilters,
  ]);

  return badges.map(({label, action, key}) => (
    <Badge key={key} testId="selectedFilter">
      <Badge.Icon Icon={TagIcon} />
      {label}
      <Badge.Action onClick={action} />
    </Badge>
  ));
}

interface Props {
  filters: {[key: string]: SearchResultFilter[]};
  filterSettings: ReadonlyArray<{
    name: string;
    searchParamType: SearchParamType;
  }>;
}

interface ClearSelectedFilterProps {
  id: string;
  filterKey: string;
}

export function SelectedFilters({filters, filterSettings}: Props) {
  const t = useTranslations('Filters');
  const query = useListStore(s => s.query);
  const selectedFilters = useListStore(s => s.selectedFilters);
  const filterChange = useListStore(s => s.filterChange);
  const queryChange = useListStore(s => s.queryChange);

  function clearAllFilters() {
    queryChange('');
    filterSettings.forEach(({name, searchParamType}) => {
      if (searchParamType === 'array') {
        filterChange(name, []);
      } else {
        filterChange(name, undefined);
      }
    });
  }

  // Only show this component if there are active filters.
  if (
    !query &&
    !Object.values(selectedFilters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      } else {
        return value !== undefined;
      }
    })
  ) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-2 mb-6 py-6 flex-wrap">
      <h3 className="text-sm text-consortiumBlue-100">{t('filters')}</h3>
      <div className="grow flex flex-row items-center gap-2 flex-wrap">
        {Object.keys(selectedFilters).map(filterKey => {
          const filterSetting = filterSettings.find(
            ({name}) => name === filterKey
          );
          if (!filterSetting) {
            throw new Error(
              `Filter setting for key ${filterKey} not found in filter settings.`
            );
          }
          return (
            <SelectedFiltersForKey
              key={filterKey}
              filters={filters[filterKey]}
              filterKey={filterKey}
              searchParamType={filterSetting.searchParamType}
            />
          );
        })}
        {query && (
          <Badge testId="selectedFilter">
            <Badge.Icon Icon={MagnifyingGlassIcon} />
            {query}
            <Badge.Action
              onClick={() => {
                queryChange('');
              }}
            />
          </Badge>
        )}
      </div>
      <button
        type="button"
        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={clearAllFilters}
      >
        {t('clearAllFilters')}
      </button>
    </div>
  );
}
