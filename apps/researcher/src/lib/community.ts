import {clerkClient, auth} from '@clerk/nextjs';
import {
  OrganizationMembership,
  OrganizationMembershipPublicUserData,
  Organization as FullCommunity,
} from '@clerk/backend/dist/types';

export type Community = Pick<
  FullCommunity,
  'id' | 'name' | 'slug' | 'imageUrl' | 'createdAt'
>;

export type Membership = Pick<OrganizationMembership, 'id' | 'role'> & {
  publicUserData?: Pick<
    OrganizationMembershipPublicUserData,
    'userId' | 'firstName' | 'lastName' | 'profileImageUrl'
  > | null;
};

export async function getCommunityBySlug(slug: string): Promise<Community> {
  return clerkClient.organizations.getOrganization({
    slug,
  });
}

export async function getCommunityById(id: string): Promise<Community> {
  return clerkClient.organizations.getOrganization({
    organizationId: id,
  });
}

export async function getMemberships(
  communityId: string
): Promise<Membership[]> {
  return clerkClient.organizations.getOrganizationMembershipList({
    organizationId: communityId,
  });
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
}: GetCommunitiesProps): Promise<Community[]> {
  const communities = await clerkClient.organizations.getOrganizationList({
    limit,
    offset,
    query,
    // TODO: `includeMembersCount` is not working, I have reported this bug to Clerk.
    // They have confirmed it and are working on a fix.
    // When the membership count is present, we can use it to sort the communities.
    // https://discord.com/channels/856971667393609759/1151078450627624970
    includeMembersCount: true,
  });

  return sort(communities, sortBy);
}

export function isAdmin(memberships: ReadonlyArray<Membership>): boolean {
  const {userId} = auth();

  return (
    !!userId &&
    memberships.some(membership => {
      return (
        membership.publicUserData?.userId === userId &&
        membership.role === 'admin'
      );
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

export async function getUserMemberships(): Promise<OrganizationMembership[]> {
  const {userId} = auth();

  if (!userId) {
    throw new Error('No user ID');
  }

  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId,
  });

  return memberships;
}
