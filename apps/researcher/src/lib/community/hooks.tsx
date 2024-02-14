import {useClerk, useUser} from '@clerk/nextjs';
import {organizationToCommunity} from './clerk-converters';
import {useMemo} from 'react';
import {encodeRouteSegment} from '../clerk-route-segment-transformer';

interface UseCommunityProfile {
  communitySlug: string;
  communityId: string;
}

export function useCommunityProfile({
  communitySlug,
  communityId,
}: UseCommunityProfile) {
  const {openOrganizationProfile, setActive} = useClerk();

  async function openProfile(firstPage: 'settings' | 'members') {
    // Set the active organization to the community so the correct profile is loaded.
    await setActive({organization: communityId});
    // We want to show only one page of the organization's profile.
    // But it is impossible to load only one page, so the next best thing is to hide the navbar and only show the first page.
    // We must place all pages in `customPage` to define the page order.
    // Pages not in `customPages` will load before the custom pages. So, we need to add all pages to control the first loaded page.
    openOrganizationProfile({
      afterLeaveOrganizationUrl: `/revalidate/?path=${encodeRouteSegment(
        `/[locale]/communities/${communitySlug}`
      )}&redirect=${encodeRouteSegment(`/communities/${communitySlug}`)}`,
      customPages: ['settings', 'members']
        .sort((customPageA, customPageB) =>
          customPageA === firstPage ? -1 : customPageB === firstPage ? 1 : 0
        )
        .map(page => ({label: page})),
      appearance: {
        elements: {
          navbar: 'hidden',
        },
      },
    });
  }

  return {openProfile};
}

export function useUserCommunities() {
  const {user, isLoaded} = useUser();

  const communities = useMemo(() => {
    if (!user || !user.organizationMemberships.length) {
      return [];
    }

    return user.organizationMemberships.map(membership =>
      organizationToCommunity(membership.organization)
    );
  }, [user]);

  return {communities, isLoaded};
}

export function useCreateCommunity() {
  const {openCreateOrganization} = useClerk();

  return {openCreateCommunity: openCreateOrganization};
}
