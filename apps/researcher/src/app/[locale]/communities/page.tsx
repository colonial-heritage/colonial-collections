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
import {SignedOut} from '@clerk/nextjs';

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
        includeMembersCount: true,
      });
    } else {
      communities = await getCommunities({
        query,
        sortBy,
        offset,
        limit: 24,
        includeMembersCount: true,
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
        }}
      />

      <div className="bg-consortium-green-300 text-consortium-blue-800 py-10 md:py-20 grow">
        <div className="flex flex-col md:flex-row gap-4 md:gap-20 w-full max-w-[1800px] mx-auto px-4 sm:px-10">
          <div className="flex flex-col gap-4 w-full md:w-3/5 max-w-md">
            <h1 className="text-2xl md:text-4xl">{t('title')}</h1>

            <div className="">
              <p>{t('pageDescription')}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full md:w-2/5 max-w-md mt-6">
            <h2>{t('yourCommunityTitle')}</h2>

            <SignedOut>
              <p>{t('yourCommunityTextSignedOut')}</p>
            </SignedOut>
            <SignedIn>
              <p>{t('yourCommunityText')}</p>
              <p>
                <AddCommunityButton />
              </p>
            </SignedIn>
          </div>
        </div>
      </div>

      <div className="text-sm w-full px-4 sm:px-10 max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between mt-8 my-16">
        <div className="flex gap-4 flex-col md:flex-row items-start md:items-center">
          <div className="flex items-center">
            <div className="w-full max-w-[450px] relative">
              {onlyMyCommunities === undefined && (
                <div>
                  <SearchField placeholder={t('searchPlaceholder')} />
                </div>
              )}
            </div>
          </div>
          <div className="mb-3 md:mb-0 flex items-center">
            <SignedIn>
              <MyCommunityToggle />
              <label className="ml-2" htmlFor="onlyMy">
                {t('showMyCommunities')}
              </label>
            </SignedIn>
          </div>
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full grow content-stretch gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 mt-28">
        {communities.map(community => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
      <div className="px-4 sm:px-10 w-full max-w-[1800px] mx-auto">
        <Paginator />
      </div>
    </>
  );
}
