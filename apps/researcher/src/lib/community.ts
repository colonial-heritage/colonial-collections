import {clerkClient, auth} from '@clerk/nextjs';
import {OrganizationMembership, Organization} from '@clerk/backend/dist/types';

export interface Community {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  createdAt: number;
}

export interface Membership {
  id: string;
  role: string;
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

function organizationToCommunity(organization: Organization): Community {
  return {
    id: organization.id,
    name: organization.name,
    description:
      (organization.publicMetadata!.description as string | undefined) || '',
    slug: organization.slug!,
    imageUrl: organization.imageUrl,
    createdAt: organization.createdAt,
  };
}

function organizationMembershipToCommunityMembership(
  membership: OrganizationMembership
): Membership {
  if (!membership.publicUserData) {
    throw new Error(
      'organizationMembershipToCommunityMembership: publicUserData is undefined'
    );
  }

  return {
    id: membership.id,
    role: membership.role,
    userId: membership.publicUserData.userId,
    // First and last name are set to required in Clerk.
    firstName: membership.publicUserData.firstName!,
    lastName: membership.publicUserData.lastName!,
    imageUrl: membership.publicUserData.imageUrl,
  };
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

export enum SortBy {
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
  CreatedAtDesc = 'createdAtDesc',
  MembershipCountDesc = 'membershipCountDesc',
}

export const defaultSortBy = SortBy.CreatedAtDesc;

export function sort(communities: Community[], sortBy: SortBy) {
  // TODO: Implement sorting by membership count.
  // This can be done as soon as the `Community` includes membership count.
  return [...communities].sort((a, b) => {
    if (sortBy === SortBy.NameAsc) {
      return a.name.localeCompare(b.name);
    } else if (sortBy === SortBy.NameDesc) {
      return b.name.localeCompare(a.name);
    } else if (sortBy === SortBy.CreatedAtDesc) {
      return b.createdAt - a.createdAt;
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

interface JoinCommunityProps {
  organizationId: string;
  userId: string;
}

export async function joinCommunity({
  organizationId,
  userId,
}: JoinCommunityProps) {
  await clerkClient.organizations.createOrganizationMembership({
    organizationId,
    userId,
    role: 'basic_member',
  });
}

export async function editDescription({
  communityId,
  description,
}: {
  communityId: string;
  description: string;
}) {
  return clerkClient.organizations.updateOrganizationMetadata(communityId, {
    publicMetadata: {
      description,
    },
  });
}
