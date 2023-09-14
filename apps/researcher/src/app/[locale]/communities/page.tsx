import {
  getAllCommunities,
  CommunitySortBy,
  defaultCommunitySortBy,
} from '@/lib/community';
import {getTranslator} from 'next-intl/server';
import ErrorMessage from '@/components/error-message';
import CommunityCard from './community-card';

import {ClientListStore} from '@colonial-collections/list-store';
import {Paginator, SearchField, OrderSelector} from 'ui/list';

interface Props {
  params: {
    locale: string;
  };
  searchParams?: {
    query?: string;
    sortBy?: CommunitySortBy;
    offset?: number;
  };
}

// Revalidate the page
export const revalidate = 0;

export default async function CommunitiesPage({
  params,
  searchParams = {},
}: Props) {
  const t = await getTranslator(params.locale, 'Communities');

  const {query, sortBy, offset} = searchParams;

  let communities;
  try {
    communities = await getAllCommunities({
      query,
      sortBy,
      offset,
    });
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <>
      <ClientListStore
        {...{
          totalCount: communities.length,
          offset: offset ?? 0,
          limit: 12,
          query: query ?? '',
          sortBy: sortBy,
          baseUrl: '/communities',
          defaultSortBy: defaultCommunitySortBy,
        }}
      />
      <div className="px-4 my-10 sm:px-10 w-full max-w-[1800px] mx-auto">
        <h1 className="text-2xl md:text-4xl">{t('title')}</h1>
      </div>
      <div className="flex flex-col sm:flex-row justify-between h-full gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 pb-4 mb-10 -mt-6 rounded border-b">
        <div>
          <SearchField placeholder={t('searchPlaceholder')} />
        </div>
        <div>
          <OrderSelector
            values={[
              CommunitySortBy.CreatedAtDesc,
              CommunitySortBy.NameAsc,
              CommunitySortBy.NameDesc,
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full grow content-stretch gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 mt-10">
        {communities.map(community => (
          <CommunityCard
            key={community.id}
            community={community}
            locale={params.locale}
          />
        ))}
      </div>
      <div className="sm:px-10">
        <Paginator />
      </div>
    </>
  );
}
