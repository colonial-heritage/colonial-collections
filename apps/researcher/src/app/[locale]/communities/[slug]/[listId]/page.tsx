import {getTranslations} from 'next-intl/server';
import {objectList as objectListDb} from '@colonial-collections/database';
import ErrorMessage from '@/components/error-message';
import Link from 'next/link';
import {ChevronLeftIcon, PencilSquareIcon} from '@heroicons/react/24/solid';
import ObjectCard from './object-card';
import {getCommunityBySlug} from '@/lib/community/actions';
import {
  LocalizedMarkdown,
  Notifications,
  SlideOut,
  SlideOutButton,
  SlideOutClosed,
} from '@colonial-collections/ui';
import Protect from '@/lib/community/protect';
import {InformationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import ManageObjectCard from './manage-object-card';
import EditObjectListForm from '@/components/object-list-form/edit-form';
import {DeleteListButton} from './buttons';

interface Props {
  params: {
    slug: string;
    listId: string;
  };
}

const slideOutEditId = 'edit-list';
const slideOutManageItemsId = 'manage-items';

export default async function Page({params}: Props) {
  const t = await getTranslations('ObjectList');

  let objectList;
  try {
    objectList = await objectListDb.find(+params.listId);
  } catch (err) {
    console.error(err);
    return <ErrorMessage error={t('error')} />;
  }

  if (!objectList) {
    return <ErrorMessage error={t('noEntity')} testId="no-entity" />;
  }

  let community;
  try {
    community = await getCommunityBySlug(params.slug);
  } catch (err) {
    return <ErrorMessage error={t('noCommunity')} />;
  }

  if (!community) {
    // Todo loading
    return null;
  }

  return (
    <>
      <div className="px-10 w-full flex gap-2 flex-row sm:justify-between max-w-[1800px] mx-auto my-12">
        <div className="flex gap-2">
          <Link
            href={`/communities/${params.slug}`}
            className="no-underline rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm bg-neutral-100 flex gap-1 items-center"
          >
            <ChevronLeftIcon className="w-4 h-4 fill-consortium-blue-800" />
            {t('backButton')}
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 max-w-[1800px] mx-auto px-10 mb-40">
        <main className="w-full order-2 md:order-1">
          <div className="my-4 flex flex-col gap-4 w-full bg max-w-[1800px] mx-auto">
            <div className="text-sm text-neutral-600">
              {t('listCreatedBy')}{' '}
              <Link href={`/communities/${params.slug}`}>
                {community?.name}
              </Link>
            </div>
            <Notifications />
            <SlideOutClosed id={slideOutEditId}>
              <div className="block">
                <div className="flex flex-col md:flex-row justify-between">
                  <h1 className="text-2xl md:text-4xl mb-4">
                    {objectList.name}
                  </h1>
                  <div>
                    <Protect
                      communityId={community.id}
                      permission="org:sys_profile:manage"
                    >
                      <SlideOutButton
                        id={slideOutEditId}
                        testId="edit-list-button"
                        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
                      >
                        <PencilSquareIcon className="w-4 h-4 fill-neutral-500" />
                        {t('editButton')}
                      </SlideOutButton>
                    </Protect>
                  </div>
                </div>
                <p className="mb-4 max-w-3xl">{objectList.description}</p>
              </div>
            </SlideOutClosed>
            <SlideOut id={slideOutEditId}>
              <EditObjectListForm
                communityId={community.id}
                slideOutId={slideOutEditId}
                list={objectList}
              />
              <div className="flex flex-row w-full justify-between bg-red-50 p-4 border border-red-100 rounded-xl max-w-3xl">
                <div className="w-full md:w-2/3 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2>{t('deleteListTitle')}</h2>
                    <p>{t('deleteListDescription')}</p>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-end items-center">
                  <DeleteListButton
                    id={objectList.id}
                    communitySlug={community.slug}
                  />
                </div>
              </div>
            </SlideOut>
          </div>
          <Protect
            communityId={community.id}
            permission="org:sys_profile:manage"
          >
            <SlideOutClosed id={slideOutManageItemsId}>
              <div className="flex justify-end w-full mt-16 lg:mt-0 ">
                <SlideOutButton
                  id={slideOutManageItemsId}
                  testId="manage-items-button"
                  className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
                >
                  <PencilSquareIcon className="w-4 h-4 fill-neutral-500" />
                  {t('manageItemsButton')}
                </SlideOutButton>
              </div>
            </SlideOutClosed>
            <SlideOut id={slideOutManageItemsId}>
              <div className="flex-col md:flex-row justify-between w-full items-center gap-4 mt-16 bg-neutral-50 rounded pl-3 flex">
                <div className="text-sm">
                  <InformationCircleIcon className="w-5 h-5 stroke-neutral-500" />
                </div>
                <div className="text-sm grow">{t('mangeListDescription')}</div>
                <div>
                  <SlideOutButton
                    id={slideOutManageItemsId}
                    className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
                  >
                    <XMarkIcon className="w-4 h-4 stroke-neutral-900" />
                    {t('closeManageItemsButton')}
                  </SlideOutButton>
                </div>
              </div>
            </SlideOut>
          </Protect>

          {objectList.objects.length === 0 ? (
            <div className="bg-consortium-green-100 px-4 py-8 rounded max-w-3xl">
              <div className="pb-4">
                <InformationCircleIcon className="w-6 h-6 stroke-neutral-800" />
                <LocalizedMarkdown
                  name="empty-object-list"
                  contentPath="@/messages"
                  textProps={{name: objectList.name}}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4">
                <h2 className="text-xl">
                  {t('objectCount', {count: objectList.objects.length})}
                </h2>
              </div>

              <SlideOutClosed id={slideOutManageItemsId}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6">
                  {objectList.objects.map(object => (
                    <ObjectCard
                      key={object.objectId}
                      objectIri={object.objectIri}
                    />
                  ))}
                </div>
              </SlideOutClosed>
              <SlideOut id={slideOutManageItemsId}>
                <div className="block">
                  <div className="flex flex-col mt-6">
                    {objectList.objects.map(object => (
                      <ManageObjectCard
                        key={object.objectId}
                        objectIri={object.objectIri}
                        id={object.id}
                      />
                    ))}
                  </div>
                </div>
              </SlideOut>
            </>
          )}
        </main>
      </div>
    </>
  );
}
