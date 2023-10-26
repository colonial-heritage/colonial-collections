'use client';

import {useTranslations} from 'next-intl';
import {Badge} from '../badge';
import {useListStore} from '@colonial-collections/list-store';
import {SearchResultFilter} from './SearchResultFilter';
import {useMemo} from 'react';

interface Props {
  filters: {[key: string]: SearchResultFilter[]};
  filterSettings: ReadonlyArray<{
    name: string;
    searchParamType: string;
  }>;
}

interface ClearSelectedFilterProps {
  id: string;
  filterKey: string;
}

export function SelectedFilters({filters, filterSettings}: Props) {
  const t = useTranslations('Filters');
  const {query, selectedFilters, filterChange, queryChange} = useListStore();

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
        selectedFilterForKey?.filter((filterId: string) => id !== filterId) ||
          []
      );
    }

    function clearSelectedNumberFilter(filterKey: string) {
      filterChange(filterKey, undefined);
    }

    function clearQuery() {
      queryChange('');
    }

    const badges = [];
    Object.entries(selectedFilters).forEach(([filterKey, value]) => {
      if (
        filterSettings.find(setting => setting.name === filterKey)
          ?.searchParamType === 'number' &&
        value
      ) {
        badges.push({
          key: `${filterKey}-${value}`,
          label: value.toString(),
          action: () => clearSelectedNumberFilter(filterKey),
        });
      } else if (
        filterSettings.find(setting => setting.name === filterKey)
          ?.searchParamType === 'array' &&
        value
      ) {
        (value as string[]).forEach(id => {
          badges.push({
            key: `${filterKey}-${id}`,
            label: filters[filterKey as keyof typeof filters].find(
              ({id: i}) => i === id
            )!.name,
            action: () => clearSelectedArrayFilter({id, filterKey}),
          });
        });
      }
    });
    if (query) {
      badges.push({
        key: 'query',
        label: query,
        action: clearQuery,
      });
    }
    return badges;
  }, [
    filterChange,
    filterSettings,
    filters,
    query,
    queryChange,
    selectedFilters,
  ]);

  // Only show this component if there are active filters.
  if (!badges.length) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center">
      <h3 className="text-xs font-medium text-gray-500">{t('filters')}</h3>
      <div
        aria-hidden="true"
        className="hidden h-5 w-px bg-gray-300 sm:ml-3 sm:block mr-2"
      />
      <div className="flex flex-wrap grow">
        {badges.map(({label, action, key}) => (
          <Badge key={key} testId="selectedFilter">
            {label}
            <Badge.Action onClick={action} />
          </Badge>
        ))}
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
