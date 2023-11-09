'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useClerk, useUser, useOrganizationList} from '@clerk/nextjs';
import {useTransition} from 'react';
import {joinCommunityAndRevalidate} from './actions';
import {PencilSquareIcon, ChevronDownIcon} from '@heroicons/react/24/solid';
import {Fragment} from 'react';
import {Menu, Transition} from '@headlessui/react';
import {SlideOutButton} from '@colonial-collections/ui';

interface Props {
  communityId: string;
  communitySlug: string;
}

// If logged in and not part of the community, show the join button
export function JoinCommunityButton({communityId, communitySlug}: Props) {
  const {isLoaded, isSignedIn, user} = useUser();
  const [isClicked, setIsClicked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Community');

  const userIsMember =
    !!user &&
    user.organizationMemberships.some(
      membership => membership.organization.id === communityId
    );

  const showJoinButton = isLoaded && isSignedIn && !userIsMember;

  if (!showJoinButton) {
    return null;
  }

  const joinCommunityClick = () => {
    setIsClicked(true);
    startTransition(async () => {
      try {
        await joinCommunityAndRevalidate({
          communityId,
          communitySlug,
          userId: user!.id,
        });
      } catch (err) {
        setIsClicked(false);
        setHasError(true);
        console.error(err);
      }
    });
  };

  // TODO: add correct layout
  if (hasError) {
    return <div>Something went wrong</div>;
  }

  // TODO: add correct layout
  if (isPending) {
    return <div>Loading...</div>;
  }

  // TODO: add correct layout
  if (isClicked) {
    return <div>You have joined the organization</div>;
  }

  return (
    <button
      className="p-1 sm:py-2 sm:px-3 rounded-full bg-yellow-100 hover:bg-yellow-200 transition text-yellow-800 flex items-center gap-1"
      onClick={() => joinCommunityClick()}
    >
      {t('joinButton')}
    </button>
  );
}

const menuItems = [
  {translationKey: 'settingsButton', page: 'settings'},
  {translationKey: 'membersButton', page: 'members'},
];

interface ButtonGroupProps {
  slideOutEditFormId: string;
  communityId: string;
  communitySlug: string;
}

export function ButtonGroup({
  slideOutEditFormId,
  communityId,
  communitySlug,
}: ButtonGroupProps) {
  const t = useTranslations('Community');
  const {openOrganizationProfile} = useClerk();
  const {setActive} = useOrganizationList();

  const openClerkProfile = (firstPage: string) => {
    // Only the active organization can be edited.
    setActive && setActive({organization: communityId});
    // We want to show only one page of the organization's profile.
    // But it is impossible to load only one page, so the next best thing is to hide the navbar and only show the first page.
    // We must place all pages in `customPage` to define the page order.
    // Pages not in `customPages` will load before the custom pages. So, we need to add all pages to control the first loaded page.
    openOrganizationProfile({
      afterLeaveOrganizationUrl: `/revalidate/?path=/[locale]/communities/${communitySlug}&redirect=/communities/${communitySlug}`,
      customPages: ['settings', 'members']
        .sort((a, b) => {
          return a === firstPage ? -1 : b === firstPage ? 1 : 0;
        })
        .map(page => ({label: page})),
      appearance: {
        elements: {
          navbar: 'hidden',
        },
      },
    });
  };

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <SlideOutButton
        id={slideOutEditFormId}
        className="relative inline-flex items-center rounded-l-md bg-neutral-200 hover:bg-neutral-300 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10"
      >
        <PencilSquareIcon className="w-5 h-5 fill-neutral-700" />
        {t('editButton')}
      </SlideOutButton>
      <Menu as="div" className="relative -ml-px block">
        <Menu.Button className="relative inline-flex items-center rounded-r-md bg-neutral-200 hover:bg-neutral-300 px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-10">
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {menuItems.map(item => (
                <Menu.Item key={item.translationKey}>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700"
                    onClick={() => openClerkProfile(item.page)}
                  >
                    {t(item.translationKey)}
                  </button>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
