import {ChevronLeftIcon, PlusIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import {getTranslator} from 'next-intl/server';
import {JoinCommunityButton, EditCommunityButton} from './buttons';
import {getMemberships, getCommunityBySlug, isAdmin} from '@/lib/community';
import ErrorMessage from '@/components/error-message';
import {ClerkAPIResponseError} from '@clerk/shared';
import {revalidatePath} from 'next/cache';
import {objectList} from '@colonial-collections/database';
import ObjectCard from './object';
import {
  SlideOver,
  SlideOverContent,
  SlideOverDialog,
  SlideOverOpenButton,
} from 'ui';
import AddObjectListForm from '@/components/add-object-list-form';

interface Props {
  params: {
    slug: string;
    locale: string;
  };
}

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

  const objectLists = await objectList.getCommunityListsWithObjects(
    community.id
  );

  return (
    <>
      <div className=" px-4 sm:px-10 -mt-3 -mb-3 sm:-mb-9 flex gap-2 flex-row sm:justify-between w-full max-w-[1800px] mx-auto">
        <div>
          <Link href="/communities" className="flex items-center gap-1">
            <ChevronLeftIcon className="w-4 h-4 fill-neutral-500" />
            {t('backButton')}
          </Link>
        </div>
        <div className="sm:flex justify-end gap-4 hidden">
          {isAdmin(memberships) && <EditCommunityButton />}
        </div>
      </div>
      <div className="px-4 my-10 sm:px-10 w-full max-w-[1800px] mx-auto">
        <h1 className="text-2xl md:text-4xl font-normal">
          {t('title')}
          <span className="font-semibold ml-2" data-testid="community-name">
            {community.name}
          </span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full max-w-[1800px] mx-auto px-4 sm:px-10">
        <main className="w-full md:w-3/4">
          <div className="w-full flex flex-col md:flex-row justify-between">
            <div className="mb-4 max-w-3xl">
              {/*Place the description here*/}
            </div>
            <div className="flex flex-col items-start md:justify-center md:items-center w-full mb-4">
              <JoinCommunityButton communityId={community.id} />
            </div>
          </div>
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="mb-6">{t('objectListsTitle')}</h2>
            <div className="mt-3 sm:ml-4 sm:mt-0">
              <SlideOver>
                <SlideOverOpenButton className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {t('addObjectListButton')}
                  <PlusIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                </SlideOverOpenButton>
                <SlideOverDialog>
                  <SlideOverContent>
                    <AddObjectListForm />
                  </SlideOverContent>
                </SlideOverDialog>
              </SlideOver>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
            {objectLists.map(objectList => (
              <div
                key={objectList.id}
                className=" bg-amber-50 rounded p-6 -m-2 cursor-pointer"
              >
                <h3 className="font-semibold text-xl mt-4 mb-2">
                  {objectList.name}
                </h3>
                <p>{objectList.description}</p>
                {objectList.objects.length > 0 && (
                  <ul className=" grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                    {objectList.objects.map(object => (
                      <ObjectCard
                        key={object.objectId}
                        objectId={object.objectId}
                      />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </main>
        <aside className="w-full md:w-1/4 self-stretch">
          <h2 className="mb-4">{t('membersTitle')}</h2>
          <ul>
            {memberships!.map(membership => (
              <li
                className="font-normal flex items-center gap-2 mb-3"
                key={membership.id}
              >
                <div className="w-10">
                  {membership.publicUserData?.profileImageUrl && (
                    <Image
                      src={membership.publicUserData.profileImageUrl}
                      alt=""
                      className="w-full rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="">
                    {membership.publicUserData?.firstName}{' '}
                    {membership.publicUserData?.lastName}
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
