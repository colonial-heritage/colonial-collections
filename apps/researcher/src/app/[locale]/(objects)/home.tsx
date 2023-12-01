import {Background} from '@colonial-collections/ui/branding';
import CommunityCard from '../communities/community-card';
import {getCommunities} from '@/lib/community/actions';
import ErrorMessage from '@/components/error-message';
import {SortBy} from '@/lib/community/definitions';
import {useLocale} from 'next-intl';
import {getTranslator} from 'next-intl/server';
import {CommunitiesLink, Description} from './labels';
import {SearchField} from './search-field';

export default async function Home() {
  const locale = useLocale();
  const t = await getTranslator(locale, 'Home');

  let communities;
  try {
    communities = await getCommunities({
      sortBy: SortBy.CreatedAtDesc,
      limit: 4,
    });
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <div className=" flex flex-col md:flex-row grow gap-4 md:gap-16 w-full mx-auto">
      <main className="w-full flex flex-col  text-white">
        <div className="w-full bg-consortiumBlue-800 flex flex-col justify-center text-consortiumGreen-400 items-center min-h-[60vh] relative">
          <div className="flex justify-center w-full max-w-6xl absolute bottom-0 opacity-20">
            <Background />
          </div>
          <div className="w-full max-w-4xl px-4 sm:px-10 flex flex-col gap-10 relative pb-16">
            <h1 className="text-3xl lg:text-5xl mt-4">{t('title')}</h1>
            <p className="max-w-2xl text-lg">
              <Description />
            </p>
            <div className="flex flex-col gap-2 max-w-3xl">
              <label htmlFor="s1">
                <strong>{t('searchLabel')}</strong>
              </label>
              <SearchField placeholder={t('searchPlaceholder')} />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center py-20 gap-6 text-consortiumBlue-800">
          <div className="w-full max-w-4xl px-4 sm:px-10 flex flex-col gap-10 relative pb-10">
            <h2 className="text-5xl">{t('communitiesTitle')}</h2>
            <p className="max-w-xl">{t('communitiesDescription')}</p>
            <p className="max-w-xl">
              <CommunitiesLink />
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full grow content-stretch gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 pt-10">
            {communities.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
