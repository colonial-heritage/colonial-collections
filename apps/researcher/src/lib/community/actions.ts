import {clerkClient, auth} from '@clerk/nextjs';
import {cookies} from 'next/headers';
import {
  organizationMembershipToCommunityMembership,
  organizationToCommunity,
} from './clerk-converters';
import {Community, Membership, SortBy} from './definitions';

function disableCache() {
  // Some functions are still cached even when using `revalidatePath()`
  // Running this function will disable the cache
  // https://github.com/vercel/next.js/discussions/50045#discussioncomment-7218266
  // After updating to Next.js 14 we can use the official `noStore()` instead of `cookies()`
  cookies();
}

export async function getCommunityBySlug(slug: string) {
  const organization = await clerkClient.organizations.getOrganization({
    slug,
  });

  return organizationToCommunity(organization);
}

export async function getCommunityById(id: string) {
  const organization = await clerkClient.organizations.getOrganization({
    organizationId: id,
  });

  return organizationToCommunity(organization);
}

export async function getMemberships(communityId: string) {
  const organizationMembership =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: communityId,
    });

  return organizationMembership.map(
    organizationMembershipToCommunityMembership
  );
}

export const defaultSortBy = SortBy.CreatedAtDesc;

export function sort(communities: Community[], sortBy: SortBy) {
  return [...communities].sort((a, b) => {
    if (sortBy === SortBy.NameAsc) {
      return a.name.localeCompare(b.name);
    } else if (sortBy === SortBy.NameDesc) {
      return b.name.localeCompare(a.name);
    } else if (sortBy === SortBy.CreatedAtDesc) {
      if (typeof a.createdAt !== 'number' || typeof b.createdAt !== 'number') {
        throw new Error('createdAt must be of type number');
      }
      return b.createdAt - a.createdAt;
    } else if (sortBy === SortBy.MembershipCountDesc) {
      return (b.membershipCount ?? 0) - (a.membershipCount ?? 0);
    } else {
      return 0;
    }
  });
}

interface GetCommunitiesProps {
  query?: string;
  sortBy?: SortBy;
  limit?: number;
  offset?: number;
}

export async function getCommunities({
  query = '',
  sortBy = defaultSortBy,
  limit = 24,
  offset = 0,
}: GetCommunitiesProps) {
  const organizations = await clerkClient.organizations.getOrganizationList({
    limit,
    offset,
    query,
    // TODO: `includeMembersCount` is not working, I have reported this bug to Clerk.
    // They have confirmed it and are working on a fix.
    // When the membership count is present, we can use it to sort the communities.
    // https://discord.com/channels/856971667393609759/1151078450627624970
    includeMembersCount: true,
  });

  const communities = organizations.map(organizationToCommunity);

  return sort(communities, sortBy);
}

export function isAdmin(memberships: ReadonlyArray<Membership>): boolean {
  const {userId} = auth();

  return (
    !!userId &&
    memberships.some(membership => {
      return membership.userId === userId && membership.role === 'admin';
    })
  );
}

export function isMember(memberships: ReadonlyArray<Membership>): boolean {
  const {userId} = auth();

  return (
    !!userId &&
    memberships.some(membership => {
      return membership.userId === userId;
    })
  );
}

interface JoinCommunityProps {
  communityId: string;
  userId: string;
}

export async function joinCommunity({communityId, userId}: JoinCommunityProps) {
  disableCache();

  await clerkClient.organizations.createOrganizationMembership({
    organizationId: communityId,
    userId,
    role: 'basic_member',
  });
}

interface UpdateCommunityProps {
  id: string;
  name: string;
  description: string;
  attributionId: string;
  licence?: string;
}

export async function updateCommunity({
  id,
  name,
  description,
  attributionId,
  licence,
}: UpdateCommunityProps) {
  disableCache();

  const organization = await clerkClient.organizations.updateOrganization(id, {
    name,
    publicMetadata: {
      description,
      attributionId: encodeURIComponent(attributionId),
      licence: licence ? encodeURIComponent(licence) : '',
    },
  });

  return organizationToCommunity(organization);
}
