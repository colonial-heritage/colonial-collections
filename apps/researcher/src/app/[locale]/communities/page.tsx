import {getAllCommunities} from '@/lib/community';
import {getTranslator} from 'next-intl/server';
import ErrorMessage from '@/components/error-message';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import CommunityCard from './community-card';

interface Props {
  params: {
    locale: string;
  };
}

// Revalidate the page
export const revalidate = 0;

export default async function CommunitiesPage({params}: Props) {
  const t = await getTranslator(params.locale, 'Communities');

  let communities;
  try {
    communities = await getAllCommunities();
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <>
      <div className="px-4 my-10 sm:px-10 w-full max-w-[1800px] mx-auto">
        <h1 className="text-2xl md:text-4xl">{t('title')}</h1>
      </div>
      <div className="flex flex-col sm:flex-row justify-between h-full gap-6 w-full max-w-[1800px] mx-auto px-4 sm:px-10 pb-4 mb-10 -mt-6 rounded border-b">
        <div className="">
          <div className="w-full max-w-[450px] relative">
            <label htmlFor="text-search" className="font-semibold"></label>
            <div className="flex flex-row w-full">
              <input
                className=" py-1 px-3 w-full rounded-l border border-stone-700"
                type="search"
                id="text-search"
                name="q"
                placeholder="Search for community"
              />
              <button
                className="bg-stone-700 py-1 px-3 rounded-r border-t border-b border-r border-stone-700"
                aria-label="Click to search"
                value="amster"
              >
                <MagnifyingGlassIcon className="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <select
            name="order"
            className="mt-1 block  rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
            aria-label="Select to change the ordering of the communities"
          >
            <option value="relevanceDesc">Date created</option>
            <option value="nameAsc">Name - Ascending</option>
            <option value="nameDesc">Name - Descending</option>
            <option value="members">Most members</option>
          </select>
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
    </>
  );
}
