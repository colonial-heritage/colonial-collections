import {useClerk} from '@clerk/nextjs';

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
  }

  return {openProfile};
}
