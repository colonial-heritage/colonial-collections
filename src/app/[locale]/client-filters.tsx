'use client';

import {useState, ReactNode, useEffect} from 'react';
import {SearchResult} from '@/lib/dataset-fetcher';
import FilterSet from './filter-set';
import Paginator from './paginator';
import {
  PageSidebar,
  PageContent,
  PageTitle,
  PageHeader,
} from '@/components/page';
import {useTranslations} from 'next-intl';
import SelectedFilters from './selected-filters';
import {useRouter} from 'next/navigation';
import {Sort, defaultSort} from './dataset-list';

export interface Props {
  filters: SearchResult['filters'];
  limit: SearchResult['limit'];
  totalCount: SearchResult['totalCount'];
  children: ReactNode;
}

export default function ClientFilters({
  children,
  filters,
  limit,
  totalCount,
}: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<Sort>(defaultSort);
  const t = useTranslations('Home');
  const router = useRouter();

  useEffect(() => {
    const searchParams: {[key: string]: string} = {};

    if (query) {
      searchParams.query = query;
    }

    if (selectedLicenses.length) {
      searchParams.licenses = selectedLicenses.join(',');
    }

    if (selectedPublishers.length) {
      searchParams.publishers = selectedPublishers.join(',');
    }

    if (offset) {
      searchParams.offset = `${offset}`;
    }

    if (sort !== defaultSort) {
      searchParams.sort = sort;
    }
    const encodedSearchParams = new URLSearchParams(searchParams).toString();
    if (encodedSearchParams) {
      router.replace('/?' + encodedSearchParams);
    } else {
      router.replace('/' + encodedSearchParams);
    }
  }, [query, offset, sort, selectedLicenses, selectedPublishers, router]);

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(e.target.value as Sort);
  }

  return (
    <>
      <PageSidebar>
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-900"
          >
            {t('search')}
          </label>
          <input
            data-testid="searchQuery"
            value={query}
            onChange={e => setQuery(e.target.value)}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-full border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {!!filters.licenses?.length && (
          <FilterSet
            title={t('licensesFilter')}
            searchResultFilters={filters.licenses}
            selectedFilters={selectedLicenses}
            setSelectedFilters={setSelectedLicenses}
            testId="licensesFilter"
          />
        )}
        {!!filters.licenses?.length && (
          <FilterSet
            title={t('publishersFilter')}
            searchResultFilters={filters.publishers}
            selectedFilters={selectedPublishers}
            setSelectedFilters={setSelectedPublishers}
            testId="publishersFilter"
          />
        )}
      </PageSidebar>

      <PageContent>
        <PageHeader>
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <PageTitle>{t('title', {totalDatasets: totalCount})}</PageTitle>
            </div>
            <div>
              <select
                name="location"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={sort}
                onChange={handleSortChange}
              >
                <option value={Sort.RelevanceDesc}>
                  {t('sortRelevanceDesc')}
                </option>
                <option value={Sort.NameAsc}>{t('sortNameAsc')}</option>
                <option value={Sort.NameDesc}>{t('sortNameDesc')}</option>
              </select>
            </div>
          </div>
          <SelectedFilters
            filters={[
              {
                searchResultFilters: filters.licenses ?? [],
                selectedFilters: selectedLicenses,
                setSelectedFilters: setSelectedLicenses,
              },
              {
                searchResultFilters: filters.publishers ?? [],
                selectedFilters: selectedPublishers,
                setSelectedFilters: setSelectedPublishers,
              },
            ]}
            query={{
              value: query,
              setQuery,
            }}
          />
        </PageHeader>

        {children}
        {totalCount && totalCount > 0 ? (
          <Paginator
            totalCount={totalCount}
            offset={offset}
            setOffset={setOffset}
            limit={limit}
          />
        ) : null}
      </PageContent>
    </>
  );
}
