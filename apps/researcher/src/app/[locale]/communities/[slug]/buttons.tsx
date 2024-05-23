'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useUser} from '@/lib/user/hooks';
import {useTransition} from 'react';
import {joinCommunityAndRevalidate} from './actions';
import {useCommunityProfile} from '@/lib/community/hooks';

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
    user.communityMemberships.some(
      membership => membership.community.id === communityId
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
      className="p-1 sm:py-2 sm:px-3 rounded-full bg-consortium-blue-800 text-consortium-green-300 transition flex items-center gap-1 hover:bg-consortium-blue-700"
      onClick={() => joinCommunityClick()}
    >
      {t('joinButton')}
    </button>
  );
}

export function ManageMembersButton({communityId, communitySlug}: Props) {
  const {openProfile} = useCommunityProfile({communitySlug, communityId});
  const t = useTranslations('Community');

  const manageMembersClick = () => openProfile('members');

  return (
    <button
      data-testid="manage-members-button"
      onClick={manageMembersClick}
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
    >
      {t('membersButton')}
    </button>
  );
}
