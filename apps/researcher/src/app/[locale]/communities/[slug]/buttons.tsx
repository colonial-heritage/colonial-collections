'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useClerk, useUser} from '@clerk/nextjs';
import {useTransition} from 'react';
import {joinCommunityAndRevalidate} from './actions';

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

export function EditCommunityButton() {
  const t = useTranslations('Community');
  const {openOrganizationProfile} = useClerk();

  return (
    <button
      onClick={() => {
        openOrganizationProfile();
      }}
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-greenGrey-100 hover:bg-greenGrey-200 transition text-greenGrey-800 flex items-center gap-1"
    >
      {t('editButton')}
    </button>
  );
}
