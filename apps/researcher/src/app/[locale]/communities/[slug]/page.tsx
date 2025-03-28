import {ChevronLeftIcon, PencilSquareIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {JoinCommunityButton, ManageMembersButton} from './buttons';
import {getMemberships, getCommunityBySlug} from '@/lib/community/actions';
import ErrorMessage from '@/components/error-message';
import {ClerkAPIResponseError} from '@clerk/shared';
import {revalidatePath} from 'next/cache';
import {objectList} from '@colonial-collections/database';
import ObjectCard from './object';
import CreateObjectListForm from '@/components/object-list-form/create-form';
import {
  SlideOutButton,
  SlideOut,
  SlideOutClosed,
  Notifications,
  LocalizedMarkdown,
} from '@colonial-collections/ui';
import EditCommunityForm from './edit-community-form';
import ToFilteredListButton from '@/components/to-filtered-list-button';
import Protect from '@/lib/community/protect';
import {InformationCircleIcon} from '@heroicons/react/24/outline';
import SignedIn from '@/lib/community/signed-in';

interface Props {
  params: {
    slug: string;
  };
}

const slideOutFormId = 'add-object-list';
const slideOutEditFormId = 'edit-community-description';

// Don't cache this page, so we always get the latest community data from the third-party Clerk.
// With 'force-dynamic', the description in the Clerk metadata will change after editing.
export const dynamic = 'force-dynamic';

export default async function CommunityPage({params}: Props) {
  const t = await getTranslations('Community');

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
    console.error(err);
    return <ErrorMessage error={t('error')} />;
  }

  let memberships;
  try {
    memberships = await getMemberships(community.id);
  } catch (err) {
    console.error(err);
    return <ErrorMessage error={t('error')} />;
  }

  let objectLists;
  try {
    objectLists = await objectList.getByCommunityId(community.id, {
      withObjects: true,
      limitObjects: 4,
    });
  } catch (err) {
    console.error(err);
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <>
      <div className="bg-consortium-green-300 text-consortium-blue-800 relative">
        <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto pt-10 flex justify-between">
          <div>
            <ToFilteredListButton
              baseUrl="/communities"
              className="flex items-center gap-1 no-underline"
            >
              <ChevronLeftIcon className="w-4 h-4 fill-consortium-blue-800" />
              {t('backButton')}
            </ToFilteredListButton>
          </div>
          <div>
            <Protect
              communityId={community.id}
              permission="org:sys_profile:manage"
            >
              <div className="w-full flex justify-end -mb-8">
                <SlideOutButton
                  testId="edit-community"
                  id={slideOutEditFormId}
                  className="p-1 sm:py-2 sm:px-3 text-sm rounded-full bg-consortium-blue-800 text-consortium-green-300 transition flex items-center gap-1 hover:bg-consortium-blue-700"
                >
                  <PencilSquareIcon className="w-5 h-5 fill-consortium-green-300" />
                  {t('editButton')}
                </SlideOutButton>
              </div>
            </Protect>
          </div>
        </div>
        <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto pt-4 pb-10 md:pt-10 md:pb-16 xl:pt-16 xl:pb-20 flex flex-col lg:flex-row gap-10">
          <SlideOutClosed id={slideOutEditFormId}>
            <main className="w-full lg:w-2/3 xl:w-3/4">
              <h1
                className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl max-w-5xl inline-flex gap-2"
                tabIndex={0}
              >
                <span className="font-normal">{t('title')}</span>
                <span data-testid="community-name">{community.name}</span>
              </h1>
              <p className="mt-6 max-w-2xl">{community.description}</p>
              <p className="pt-4">
                <JoinCommunityButton
                  communityId={community.id}
                  communitySlug={params.slug}
                />
              </p>
            </main>
            <div className="w-full lg:w-1/3 xl:w-1/4 text-smlg:pt-10 ">
              <Image
                width="0"
                height="0"
                className="w-32 h-32 lg:w-48 lg:h-48 rounded-full  border border-consortium-blue-700 object-cover"
                sizes="(min-width: 1024px) 192px, 128px"
                src={community.imageUrl}
                alt=""
              />
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
              />
            </div>
          </SlideOut>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full max-w-[1800px] mx-auto px-4 sm:px-10 mt-12">
        <div className="w-full md:w-3/4">
          <div className="flex justify-between my-4">
            <div>
              <h2
                className="text-xl"
                tabIndex={0}
                arial-label={t('accessibilityObjectListsTitle')}
              >
                {t('objectListsTitle')}
              </h2>
              {objectLists.length > 0 && (
                <p>{t('objectListsSubTitle', {count: objectLists.length})}</p>
              )}
            </div>
            <div>
              <Protect
                communityId={community.id}
                permission="org:sys_profile:manage"
              >
                <SlideOutButton
                  testId="add-object-list-button"
                  id={slideOutFormId}
                  className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
                >
                  {t('addObjectListButton')}
                </SlideOutButton>
              </Protect>
            </div>
          </div>

          <Notifications />
          <SlideOut id={slideOutFormId}>
            <CreateObjectListForm
              slideOutId={slideOutFormId}
              communityId={community.id}
            />
          </SlideOut>

          {objectLists.length === 0 ? (
            <div className="bg-consortium-blue-50 px-4 py-8 rounded max-w-3xl">
              <div className="pb-4">
                <InformationCircleIcon className="w-6 h-6 stroke-neutral-800" />
                <LocalizedMarkdown
                  name="empty-community"
                  contentPath="@/messages"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-16">
              {objectLists.map(objectList => (
                <Link
                  data-testid={`object-list-item-${objectList.id}`}
                  href={`/communities/${params.slug}/${objectList.id}`}
                  key={objectList.id}
                  className="no-underline bg-consortium-light-blue-100 rounded-lg flex flex-col justify-between"
                >
                  <div className="text-sm text-consortium-blue-500 pt-4 px-4">
                    {t('objectListsCardType')}
                  </div>
                  <div className="px-4 pb-2">
                    <h3 className="font-semibold text-lg mb-2">
                      {objectList.name}
                    </h3>
                    <p>{objectList.description}</p>
                  </div>

                  <div className="w-full relative">
                    <ul className="mt-4 grid grid-cols-4 gap-2 min-h-24">
                      {objectList.objects?.map(object => (
                        <ObjectCard
                          key={object.objectId}
                          objectIri={object.objectIri}
                        />
                      ))}
                    </ul>

                    <div className="absolute bg-gradient-to-l from-consortium-blue-800 from-10% w-full top-0 bottom-0 flex justify-end pr-10">
                      <button className="p-2 self-center flex items-center py-2 px-6 rounded-full bg-consortium-light-blue-100 text-consortium-blue-800 hover:bg-consortium-green-400 transition">
                        {t('goToListButton')}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <SignedIn>
          <aside className="w-full md:w-1/4 self-stretch">
            <div className="flex justify-between">
              <h2 className="mb-4 text-xl">{t('membersTitle')}</h2>
              <div>
                <Protect
                  communityId={community.id}
                  permission="org:sys_profile:manage"
                >
                  <ManageMembersButton
                    communityId={community.id}
                    communitySlug={params.slug}
                  />
                </Protect>
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
                    <div>
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
        </SignedIn>
      </div>
    </>
  );
}
