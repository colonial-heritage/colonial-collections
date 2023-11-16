'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useUser} from '@clerk/nextjs';
import {useTransition} from 'react';
import {joinCommunityAndRevalidate} from './actions';
import {useCommunityProfile} from '@/lib/community/community-hooks';

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

  async function joinCommunityClick() {
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
  }

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

export function ManageMembersButton({communityId, communitySlug}: Props) {
  const {openProfile} = useCommunityProfile({communitySlug, communityId});
  const t = useTranslations('Community');

  const manageMembersClick = () => {
    openProfile('members');
  };

  return (
    <button
      onClick={manageMembersClick}
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1"
    >
      {t('membersButton')}
    </button>
  );
}
