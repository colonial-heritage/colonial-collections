import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import {getTranslator} from 'next-intl/server';
import {JoinCommunityButton, ManageMembersButton} from './buttons';
import {
  getMemberships,
  getCommunityBySlug,
  isAdmin,
  isMember,
} from '@/lib/community/actions';
import ErrorMessage from '@/components/error-message';
import {ClerkAPIResponseError} from '@clerk/shared';
import {revalidatePath} from 'next/cache';
import {objectList} from '@colonial-collections/database';
import ObjectCard from './object';
import AddObjectListForm from '@/components/add-object-list-form';
import {
  SlideOutButton,
  SlideOut,
  SlideOutClosed,
  Notifications,
} from '@colonial-collections/ui';
import EditCommunityForm from './edit-community-form';
import {ToFilteredListButton} from '@colonial-collections/ui/list';

interface Props {
  params: {
    slug: string;
    locale: string;
  };
}

const slideOutFormId = 'add-object-list';
const slideOutEditFormId = 'edit-community-description';

// Don't cache this page, so we always get the latest community data from the third-party Clerk.
// With 'force-dynamic', the description in the Clerk metadata will change after editing.
export const dynamic = 'force-dynamic';

export default async function CommunityPage({params}: Props) {
  const t = await getTranslator(params.locale, 'Community');

  let community;
  try {
    community = await getCommunityBySlug(params.slug);
  } catch (err) {
    const errorStatus = (err as ClerkAPIResponseError).status;
    if (errorStatus === 404 || errorStatus === 410) {
      // This could be a sign of a deleted community in the cache.
      // So, revalidate the communities page.
      revalidatePath('/[locale]/communities', 'page');
      return <ErrorMessage error={t('noEntity')} testId="no-entity" />;
    }
    return <ErrorMessage error={t('error')} />;
  }

  let memberships;
  try {
    memberships = await getMemberships(community.id);
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  let objectLists;
  try {
    objectLists = await objectList.getByCommunityId(community.id, {
      withObjects: true,
      limitObjects: 4,
    });
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <>
      <div className="px-4 sm:px-10 flex gap-2 flex-row sm:justify-between w-full max-w-[1800px] mx-auto">
        <div>
          <ToFilteredListButton className="flex items-center gap-1">
            <ChevronLeftIcon className="w-4 h-4 fill-neutral-500" />
            {t('backButton')}
          </ToFilteredListButton>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full max-w-[1800px] mx-auto px-4 sm:px-10 mt-12">
        <main className="w-full">
          {isMember(memberships) && !community.canAddEnrichments && (
            <div className="w-full block">
              <div className="rounded mb-4 flex flex-col items-center md:flex-row justify-between gap-2 bg-neutral-200 w-full mx-auto ">
                <div className="bg-orange-400 p-3 rounded-l">
                  <ExclamationTriangleIcon className="w-6 h-6 fill-neutral-700" />
                </div>
                <div className="p-2">
                  <p>{t('noAttributionIdWarning')}</p>
                </div>
                <div className="p-2">
                  {isAdmin(memberships) && (
                    <SlideOutButton
                      id={slideOutEditFormId}
                      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-700 hover:bg-neutral-800
                  text-neutral-100 transition flex items-center gap-1"
                    >
                      {t('addAttributionIdButton')}
                    </SlideOutButton>
                  )}
                </div>
              </div>
            </div>
          )}
          {isAdmin(memberships) && (
            <div className="w-full flex justify-end -mb-8">
              <SlideOutButton
                id={slideOutEditFormId}
                className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1"
              >
                <PencilSquareIcon className="w-5 h-5 fill-neutral-700" />
                {t('editButton')}
              </SlideOutButton>
            </div>
          )}
          <div className="-mb-16 md:-mb-24 w-full flex justify-center">
            <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full overflow-hidden relative">
              <Image
                fill
                sizes="(min-width: 1024px) 192px, 128px"
                src={community.imageUrl}
                alt=""
              />
            </div>
          </div>
          <SlideOutClosed id={slideOutEditFormId}>
            <div className="w-full rounded-lg bg-[#f3eee2] text-stone-800 pt-16 md:pt-24 pb-6 transition">
              <h1 className="text-2xl font-normal w-full text-center mt-4 px-4 my-6">
                {t('title')}
                <span
                  className="font-semibold ml-2"
                  data-testid="community-name"
                >
                  {community.name}
                </span>
              </h1>
              <div className="w-full flex flex-col md:flex-row justify-center px-4">
                <div className="mb-4 max-w-3xl text-left whitespace-pre-line">
                  {community.description}
                </div>
              </div>
              <div className="flex flex-col items-start md:justify-center md:items-center w-full mb-4">
                <JoinCommunityButton
                  communityId={community.id}
                  communitySlug={params.slug}
                />
              </div>
            </div>
          </SlideOutClosed>
          <SlideOut id={slideOutEditFormId}>
            <div className="w-full rounded-lg text-stone-800 pt-16 md:pt-24 pb-6 transition bg-neutral-50">
              <EditCommunityForm
                communityId={community.id}
                slideOutId={slideOutEditFormId}
                description={community.description}
                name={community.name}
                slug={community.slug!}
                attributionId={community.attributionId}
                license={community.license}
              />
            </div>
          </SlideOut>

          <div className="mt-12">
            <div className="flex justify-between my-4">
              <div>
                <h2>{t('objectListsTitle')}</h2>
                <p>{t('objectListsSubTitle', {count: objectLists.length})}</p>
              </div>
              <div>
                {isAdmin(memberships) && (
                  <SlideOutButton
                    id={slideOutFormId}
                    className="flex items-center py-2 px-3 rounded-full bg-sand-100 text-sand-900 hover:bg-white transition text-xs"
                  >
                    {t('addObjectListButton')}
                  </SlideOutButton>
                )}
              </div>
            </div>

            <Notifications />
            <SlideOut id={slideOutFormId}>
              <AddObjectListForm
                slideOutId={slideOutFormId}
                communityId={community.id}
              />
            </SlideOut>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-16">
              {objectLists.map(objectList => (
                <Link
                  href={`/communities/${params.slug}/${objectList.id}`}
                  key={objectList.id}
                  className="text-neutral-800"
                >
                  <h3 className="font-semibold text-xl mt-4 mb-2">
                    {objectList.name}
                  </h3>
                  <p>{objectList.description}</p>

                  <div className="w-full relative">
                    <ul className=" mt-4 grid grid-cols-4 gap-2">
                      {objectList.objects?.map(object => (
                        <ObjectCard
                          key={object.objectId}
                          objectIri={object.objectIri}
                        />
                      ))}
                    </ul>

                    <div className="absolute bg-gradient-to-l from-white w-full top-0 bottom-0 flex justify-end">
                      <button className="p-2 self-center flex items-center py-2 px-3 rounded-full bg-sand-100 text-sand-900 hover:bg-white transition text-xs">
                        {t('goToListButton')}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <aside className="w-full md:w-1/4 self-stretch">
          <div className="flex justify-between">
            <h2 className="mb-4">{t('membersTitle')}</h2>
            <div>
              {isAdmin(memberships) && (
                <ManageMembersButton
                  communityId={community.id}
                  communitySlug={params.slug}
                />
              )}
            </div>
          </div>
          <ul>
            {memberships!.map(membership => (
              <li
                className="font-normal flex items-center gap-2 mb-3"
                key={membership.id}
              >
                <div className="w-10">
                  {membership.imageUrl && (
                    <Image
                      src={membership.imageUrl}
                      alt=""
                      className="w-full rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="">
                    {membership.firstName} {membership.lastName}
                  </div>
                  <div className="text-neutral-600">
                    {/* Place country name here */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
