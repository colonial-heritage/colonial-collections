import {useClerk} from '@clerk/nextjs';
import {useModal} from '@colonial-collections/ui/modal';

interface UseCommunityProfile {
  communitySlug: string;
  communityId: string;
}

export function useCommunityProfile({
  communityId,
}: Omit<UseCommunityProfile, 'communitySlug'>) {
  const {setActive} = useClerk();
  const {show} = useModal();

  //  Opens the community profile modal showing specific tab (members or settings)
  //  CLERK V6 WORKAROUND: Full explanation in community-profile-modal.tsx.
  async function openProfile(page: 'settings' | 'members') {
    // Set the active organization to the community so the correct profile is loaded
    await setActive({organization: communityId});

    // Set hash BEFORE opening modal so that you don't have a flash of the wrong tab
    const hash = page === 'members' ? '#/organization-members' : '#';

    window.location.hash = hash;

    requestAnimationFrame(() => {
      show('community-profile-modal');
    });
  }

  return {openProfile};
}

export function useCreateCommunity() {
  const {openCreateOrganization} = useClerk();

  return {openCreateCommunity: openCreateOrganization};
}
