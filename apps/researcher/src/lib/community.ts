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

export async function getMemberships(
  communityId: string
): Promise<Membership[]> {
  return clerkClient.organizations.getOrganizationMembershipList({
    organizationId: communityId,
  });
}

export enum CommunitySortBy {
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
  CreatedAtDesc = 'createdAtDesc',
  MembershipCountDesc = 'membershipCountDesc',
}

export const defaultCommunitySortBy: CommunitySortBy =
  CommunitySortBy.CreatedAtDesc;

export function sortCommunities(
  communities: Community[],
  sortBy: CommunitySortBy
) {
  return [...communities].sort((a, b) => {
    if (sortBy === CommunitySortBy.NameAsc) {
      return a.name.localeCompare(b.name);
    } else if (sortBy === CommunitySortBy.NameDesc) {
      return b.name.localeCompare(a.name);
    } else if (sortBy === CommunitySortBy.CreatedAtDesc) {
      return b.createdAt - a.createdAt;
    } else {
      return 0;
    }
  });
}

interface GetAllCommunitiesProps {
  query?: string;
  sortBy?: CommunitySortBy;
  limit?: number;
  offset?: number;
}

export async function getAllCommunities({
  query = '',
  sortBy = defaultCommunitySortBy,
  limit = 24,
  offset = 0,
}: GetAllCommunitiesProps): Promise<Community[]> {
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

  return sortCommunities(communities, sortBy);
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
