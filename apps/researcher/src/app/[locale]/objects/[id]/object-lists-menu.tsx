'use client';

import {useTranslations} from 'next-intl';
import {Fragment, useState, useEffect} from 'react';
import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import {useUser} from '@clerk/nextjs';
import {getCommunityLists, addObjectToList} from './database-actions';
import {SelectObjectList} from '@colonial-collections/database';
import {useNotifications} from 'ui';

interface CommunityMenuItemsProps {
  communityId: string;
  objectId: string;
  userId: string;
}

function CommunityMenuItems({
  communityId,
  objectId,
  userId,
}: CommunityMenuItemsProps) {
  const [objectLists, setObjectLists] = useState<SelectObjectList[]>([]);
  const t = useTranslations('ObjectDetails');
  const {addNotification} = useNotifications();

  async function addObjectToListClick(objectList: SelectObjectList) {
    try {
      await addObjectToList({
        listItem: {
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
      if ((err as Error).message.includes('Duplicate entry')) {
        addNotification({
          id: 'objectAlreadyInList',
          message: t('objectAlreadyInList'),
          type: 'warning',
        });
      } else {
        addNotification({
          id: 'objectNotAddedToList',
          message: t('objectNotAddedToList'),
          type: 'error',
        });
      }
    }
  }

  useEffect(() => {
    async function getLists() {
      const lists = await getCommunityLists(communityId);
      setObjectLists(lists);
    }
    getLists();
  }, [communityId]);

  if (!objectLists.length) {
    return (
      <div className="px-4 py-2 text-sm text-gray-400 italic">
        {t('noListsInCommunity')}
      </div>
    );
  }

  return (
    <div>
      {objectLists.map(objectList => (
        <Menu.Item key={objectList.id}>
          <button
            onClick={() => addObjectToListClick(objectList)}
            className="block px-4 py-2 text-sm w-full text-left text-gray-700"
          >
            {objectList.name}
          </button>
        </Menu.Item>
      ))}
    </div>
  );
}

interface ObjectListsMenuProps {
  objectId: string;
}

export default function ObjectListsMenu({objectId}: ObjectListsMenuProps) {
  const t = useTranslations('ObjectDetails');
  const {user} = useUser();

  if (!user || !user.organizationMemberships.length) {
    return null;
  }

  const communities = user.organizationMemberships.map(m => m.organization);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="p-1 sm:py-2 sm:px-3 rounded-xl text-xs bg-greenGrey-100 text-greenGrey-800 flex items-center gap-1">
          {t('addToListButton')}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {communities.map(community => (
            <div key={community.id}>
              <div className="font-semibold	 px-2 pt-2">{community.name}</div>
              <CommunityMenuItems
                userId={user.id}
                communityId={community.id}
                objectId={objectId}
              />
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
