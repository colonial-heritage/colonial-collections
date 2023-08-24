import {clerkClient, auth} from '@clerk/nextjs';
import {
  OrganizationMembership,
  OrganizationMembershipPublicUserData,
  Organization as FullCommunity,
} from '@clerk/backend/dist/types';

type Community = Pick<FullCommunity, 'id' | 'name'>;

export type Membership = Pick<OrganizationMembership, 'id' | 'role'> & {
  publicUserData?: Pick<
    OrganizationMembershipPublicUserData,
    'userId' | 'firstName' | 'lastName' | 'profileImageUrl'
  > | null;
};

export async function getCommunity(communityId: string): Promise<Community> {
  return clerkClient.organizations.getOrganization({
    organizationId: communityId,
  });
}

export async function getMemberships(
  communityId: string
): Promise<Membership[]> {
  return clerkClient.organizations.getOrganizationMembershipList({
    organizationId: communityId,
  });
}

export function isAdminOf(memberships: ReadonlyArray<Membership>): boolean {
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
