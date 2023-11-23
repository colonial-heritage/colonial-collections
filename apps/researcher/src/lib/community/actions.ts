import {clerkClient, auth} from '@clerk/nextjs';
import {unstable_noStore as noStore} from 'next/cache';
import {
  organizationMembershipToCommunityMembership,
  organizationToCommunity,
} from './clerk-converters';
import {Community, Membership, SortBy} from './definitions';

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
    includeMembersCount: true,
  });

  const communities = organizations.map(organizationToCommunity);

  return sort(communities, sortBy);
}

export function isAdmin(memberships: ReadonlyArray<Membership>): boolean {
  noStore();
  const {userId} = auth();

  return (
    !!userId &&
    memberships.some(membership => {
      return membership.userId === userId && membership.role === 'admin';
    })
  );
}

export function isMember(memberships: ReadonlyArray<Membership>): boolean {
  noStore();
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
  noStore();

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
  license?: string;
}

export async function updateCommunity({
  id,
  name,
  description,
  attributionId,
  license,
}: UpdateCommunityProps) {
  noStore();

  const organization = await clerkClient.organizations.updateOrganization(id, {
    name,
    publicMetadata: {
      description,
      attributionId: encodeURIComponent(attributionId),
      license: license ? encodeURIComponent(license) : '',
    },
  });

  return organizationToCommunity(organization);
}
