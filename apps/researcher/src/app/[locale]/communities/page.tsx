import {getCommunities, getMyCommunities} from '@/lib/community/actions';
import {SortBy} from '@/lib/community/definitions';
import {getTranslations} from 'next-intl/server';
import ErrorMessage from '@/components/error-message';
import CommunityCard from './community-card';
import {ListStoreUpdater} from '@/components/list-store-updater';
import {
  Paginator,
  SearchField,
  OrderSelector,
} from '@colonial-collections/ui/list';
import {AddCommunityButton} from './buttons';
import {MyCommunityToggle} from './my-community-toggle';
import SignedIn from '@/lib/community/signed-in';

// 1 day = 60*60*24 = 86400
export const revalidate = 86400;

interface Props {
  searchParams?: {
    query?: string;
    sortBy?: SortBy;
    offset?: number;
    onlyMyCommunities?: 'true';
  };
}

export default async function CommunitiesPage({searchParams = {}}: Props) {
  const t = await getTranslations('Communities');

  const {query, sortBy, offset, onlyMyCommunities} = searchParams;

  let communities;
  try {
    if (onlyMyCommunities === 'true') {
      communities = await getMyCommunities({
        sortBy,
        offset,
        limit: 24,
      });
    } else {
      communities = await getCommunities({
        query,
        sortBy,
        offset,
        limit: 24,
      });
    }
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <>
      <ListStoreUpdater
        {...{
          totalCount: communities.length,
          offset: offset ?? 0,
          limit: 12,
          query: query ?? '',
          sortBy,
          selectedFilters: {onlyMyCommunities},
          baseUrl: '/communities',
          defaultSortBy: SortBy.NameAsc,
        }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center h-full gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 pt-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl">{t('title')}</h1>
          </div>
          <SignedIn>
            <div>
              <AddCommunityButton />
            </div>
          </SignedIn>
        </div>
        <div className="flex flex-col xl:flex-row items-center md:items-end gap-4 justify-end">
          {onlyMyCommunities === undefined && (
            <div>
              <SearchField placeholder={t('searchPlaceholder')} />
            </div>
          )}
          <div>
            <OrderSelector
              values={[
                SortBy.NameAsc,
                SortBy.NameDesc,
                SortBy.MembershipCountDesc,
                SortBy.CreatedAtDesc,
              ]}
            />
          </div>
        </div>
      </div>
      <div className="text-sm w-full px-4 sm:px-10 pb-4 mb-4 text-right max-w-[1800px] mx-auto">
        <SignedIn>
          <MyCommunityToggle />
          <label className="ml-2" htmlFor="onlyMy">
            {t('showMyCommunities')}
          </label>
        </SignedIn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full grow content-stretch gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 mt-10">
        {communities.map(community => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
      <div className="sm:px-10">
        <Paginator />
      </div>
    </>
  );
}
