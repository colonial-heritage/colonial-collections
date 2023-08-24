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

interface Error {
  status: number;
}

interface CommunityResponse {
  community: Community;
  error: undefined;
}

interface CommunityErrorResponse {
  community: undefined;
  error: Error;
}

export async function getCommunity(
  communityId: string
): Promise<CommunityResponse | CommunityErrorResponse> {
  let community, error;

  try {
    community = await clerkClient.organizations.getOrganization({
      organizationId: communityId,
    });
  } catch (e) {
    error = e as Error;
    return {community: undefined, error};
  }

  return {community, error};
}

interface MembershipsResponse {
  memberships: Membership[];
  error: undefined;
}

interface MembershipsErrorResponse {
  memberships: undefined;
  error: Error;
}

export async function getMemberships(
  communityId: string
): Promise<MembershipsResponse | MembershipsErrorResponse> {
  let memberships, error;

  try {
    memberships = await clerkClient.organizations.getOrganizationMembershipList(
      {
        organizationId: communityId,
      }
    );
  } catch (e) {
    error = e as Error;
    return {memberships: undefined, error};
  }

  return {memberships, error};
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
