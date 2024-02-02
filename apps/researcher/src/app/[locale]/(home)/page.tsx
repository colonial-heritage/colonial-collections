import {Background} from '@colonial-collections/ui/branding';
import CommunityCard from '../communities/community-card';
import {getCommunities} from '@/lib/community/actions';
import ErrorMessage from '@/components/error-message';
import {SortBy} from '@/lib/community/definitions';
import {getTranslations} from 'next-intl/server';
import {SearchFieldHome} from './search-field';
import {Link} from '@/navigation';

export default async function Home() {
  const t = await getTranslations('Home');

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
    <div className="flex flex-col md:flex-row grow gap-4 md:gap-16 w-full mx-auto">
      <main className="w-full flex flex-col  text-white">
        <div className="w-full bg-consortiumBlue-800 flex flex-col justify-center text-consortiumGreen-400 items-center min-h-[60vh] relative">
          <div className="flex justify-center w-full max-w-6xl absolute bottom-0 opacity-20">
            <Background />
          </div>
          <div className="w-full max-w-4xl px-4 sm:px-10 flex flex-col gap-10 relative pb-16">
            <h1 className="text-3xl lg:text-5xl mt-4">{t('title')}</h1>
            <p className="max-w-2xl text-lg">
              {t.rich('description', {
                em: text => <em>{text}</em>,
              })}
            </p>
            <div className="flex flex-col gap-2 max-w-3xl">
              <label htmlFor="search">
                <strong>{t('searchLabel')}</strong>
              </label>
              <div className="w-full lg:w-3/5 flex justify-between">
                <SearchFieldHome />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white">
          <div className="w-full max-w-4xl m-auto relative z-50">
            <div
              className="bg-white p-6 lg:rounded-xl text-consortiumBlue-800 flex flex-col gap-3 lg:shadow-xl lg:rotate-2
            lg:absolute lg:-translate-y-36 lg:-right-16 xl:-right-48 2xl:-right-60
            w-full lg:max-w-[370px]"
            >
              <div className="whitespace-pre-wrap">
                <h2 className="text-xl mb-2">{t('narrativeExplainTitle')}</h2>
                <p>{t.rich('narrativeExplainText')}</p>
              </div>
              <div className="flex gap-2 lg:justify-between my-2">
                <Link
                  href="/sign-up"
                  className="rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm bg-consortiumGreen-300 text-consortiumBlue-800 no-underline"
                >
                  {t('signupLink')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center py-20 gap-6 bg-consortiumGreen-300 text-consortiumBlue-800">
          <div className="w-full max-w-4xl px-4 sm:px-10 flex flex-col gap-10 relative pb-10">
            <h2 className="text-5xl">{t('communitiesTitle')}</h2>
            <p className="max-w-xl">{t('communitiesDescription')}</p>
            <p className="max-w-xl">
              {t.rich('communitiesLink', {
                link: text => <Link href="/communities">{text}</Link>,
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full grow content-stretch gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 pt-10">
            {communities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
