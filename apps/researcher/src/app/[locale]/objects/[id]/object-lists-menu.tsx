'use client';

import {useTranslations} from 'next-intl';
import {Fragment, useState, useEffect, useRef, useTransition} from 'react';
import {Transition, Popover} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import {CheckIcon} from '@heroicons/react/24/outline';
import {useUser} from '@clerk/nextjs';
import {
  getCommunityLists,
  addObjectToList,
  deleteObjectFromList,
} from './actions';
import {ObjectList} from '@colonial-collections/database';
import {useNotifications} from '@colonial-collections/ui';
import {useUserCommunities} from '@/lib/community/hooks';
import {Link} from '@/navigation';
import {Modal, useModal} from '@colonial-collections/ui/modal';
import ObjectListForm from '@/components/object-list-form/form';
import {addList} from '@/components/object-list-form/actions';

interface CommunityMenuItemsProps {
  communityId: string;
  objectId: string;
  userId: string;
  setSelectedCommunityId: (id: string) => void;
  canAddList: boolean;
}

function CommunityMenuItems({
  communityId,
  objectId,
  userId,
  setSelectedCommunityId,
  canAddList,
}: CommunityMenuItemsProps) {
  const [objectLists, setObjectLists] = useState<ObjectList[]>([]);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('ObjectDetails');
  const {addNotification} = useNotifications();
  const {show} = useModal();

  function createNewListClick() {
    setSelectedCommunityId(communityId);
    show('add-list-modal');
  }

  async function listClick(objectList: ObjectList) {
    const isEmptyList = !objectList.objects!.length;

    if (isEmptyList) {
      try {
        await addObjectToList({
          objectItem: {
            objectIri: objectId,
            objectListId: objectList.id,
            createdBy: userId,
          },
          communityId,
        });

        addNotification({
          id: 'objectAddedToList',
          message: t.rich('objectAddedToList', {
            name: () => <em>{objectList.name}</em>,
          }),
          type: 'success',
        });
      } catch (err) {
        addNotification({
          id: 'errorObjectAddedToList',
          message: t('errorObjectAddedToList'),
          type: 'error',
        });
      }
    } else {
      try {
        await deleteObjectFromList(objectList.objects![0].id, communityId);

        addNotification({
          id: 'objectRemovedFromList',
          message: t.rich('objectRemovedFromList', {
            name: () => <em>{objectList.name}</em>,
          }),
          type: 'success',
        });
      } catch (err) {
        addNotification({
          id: 'errorObjectRemovedFromList',
          message: t('errorObjectRemovedFromList'),
          type: 'error',
        });
      }
    }
  }

  useEffect(() => {
    async function getLists() {
      startTransition(async () => {
        const lists = await getCommunityLists(communityId, objectId);
        setObjectLists(lists);
      });
    }
    getLists();
  }, [communityId, objectId]);

  if (isPending) {
    return (
      <div className="pr-4 pl-10 py-2 text-sm consortiumBlue-600 italic">
        {t('loadingLists')}
      </div>
    );
  }

  return (
    <>
      {!objectLists.length ? (
        <div className="pr-4 pl-10 py-2 text-sm consortiumBlue-600 italic">
          {t('noListsInCommunity')}
        </div>
      ) : (
        <div>
          {objectLists.map(objectList => (
            <button
              key={objectList.id}
              data-testid={`object-list-${objectList.id}`}
              onClick={() => listClick(objectList)}
              className="group flex items-center px-4 py-2 text-sm consortiumBlue-800"
            >
              <span className="mr-2 h-4 w-4 blueGrey-500 group-hover:blueGrey-700">
                {objectList.objects!.length ? (
                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                ) : null}
              </span>
              {objectList.name}
            </button>
          ))}
        </div>
      )}
      {canAddList && (
        <button
          onClick={createNewListClick}
          className="group flex items-center pr-4 pl-10 py-2 text-sm consortiumBlue-800"
        >
          {t('createNewListButton')}
        </button>
      )}
    </>
  );
}

interface SignedInMenuProps {
  objectId: string;
  setSelectedCommunityId: (id: string) => void;
}

function SignedInMenu({objectId, setSelectedCommunityId}: SignedInMenuProps) {
  const {user} = useUser();

  return (
    <>
      {user!.organizationMemberships.map(membership => (
        <div key={membership.id}>
          <div className="px-3 py-1 no-underline">
            {membership.organization!.name}
          </div>
          <CommunityMenuItems
            userId={user!.id}
            communityId={membership.organization!.id}
            objectId={objectId}
            setSelectedCommunityId={setSelectedCommunityId}
            canAddList={membership.permissions.includes(
              'org:sys_profile:manage'
            )}
          />
        </div>
      ))}
    </>
  );
}

interface AddListModalProps {
  selectedCommunityId?: string;
}

function AddListModal({selectedCommunityId}: AddListModalProps) {
  const t = useTranslations('ObjectDetails');
  const {communities} = useUserCommunities();
  const {hide} = useModal();

  return (
    <Modal variant="medium" id="add-list-modal">
      <h2 className="font-semibold text-xl">
        {t('createObjectListTitle', {
          communityName: communities.find(c => c.id === selectedCommunityId)
            ?.name,
        })}
      </h2>
      <div className="mt-4 w-full lg:w-2/3">
        <ObjectListForm
          {...{
            communityId: selectedCommunityId!,
            closeAction() {
              hide();
            },
            saveButtonMessageKey: 'buttonCreateList',
            successfulSaveMessageKey: 'listSuccessfullyAdded',
            saveAction: addList,
            description: null,
            name: null,
          }}
        />
      </div>
    </Modal>
  );
}

const timeoutDuration = 120;

interface ObjectListsMenuProps {
  objectId: string;
}

export default function ObjectListsMenu({objectId}: ObjectListsMenuProps) {
  const {user} = useUser();
  const t = useTranslations('ObjectDetails');
  const [selectedCommunityId, setSelectedCommunityId] = useState<
    string | undefined
  >(undefined);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  function handleEnter(isOpen: boolean) {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    if (!isOpen) {
      triggerRef.current?.click();
    }
  }

  function handleLeave(isOpen: boolean) {
    timeOutRef.current = setTimeout(() => {
      if (isOpen) {
        triggerRef.current?.click();
      }
    }, timeoutDuration);
  }

  return (
    <>
      <Popover className="relative">
        {({open}) => (
          <div
            onMouseEnter={() => handleEnter(open)}
            onMouseLeave={() => handleLeave(open)}
          >
            <Popover.Button
              data-testid="add-to-list-button"
              className="peer rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm bg-consortiumGreen-300 text-consortiumBlue-800 flex gap-1 items-center"
              ref={triggerRef}
            >
              {t('addToListButton')}
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-consortiumBlue-800"
                aria-hidden="true"
              />{' '}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              {!user || user.organizationMemberships.length === 0 ? (
                <Popover.Panel
                  data-testid="add-to-list-not-signed-in-panel"
                  className="whitespace-pre-wrap block w-[250px] bg-consortiumGreen-300 text-consortiumBlue-800 drop-shadow-lg absolute top-9 -left-12 rounded-lg gap-2 border-t border-consortiumBlue-800 p-3 text-sm"
                >
                  {t.rich('addToListSignedOutText', {
                    signInLink: text => (
                      <Link className="font-semibold" href="/sign-in">
                        {text}
                      </Link>
                    ),
                    signUpLink: text => (
                      <Link className="font-semibold" href="/sign-up">
                        {text}
                      </Link>
                    ),
                    communityLink: text => (
                      <Link className="font-semibold" href="/community">
                        {text}
                      </Link>
                    ),
                  })}
                </Popover.Panel>
              ) : (
                <Popover.Panel
                  data-testid="add-to-list-signed-in-panel"
                  className="flex w-[200px] flex-col bg-consortiumGreen-300 text-consortiumBlue-800 drop-shadow-lg absolute top-9 -left-10 rounded-lg gap-2 border-t border-consortiumBlue-800"
                >
                  <SignedInMenu
                    objectId={objectId}
                    setSelectedCommunityId={setSelectedCommunityId}
                  />
                </Popover.Panel>
              )}
            </Transition>
          </div>
        )}
      </Popover>
      <AddListModal selectedCommunityId={selectedCommunityId} />
    </>
  );
}
