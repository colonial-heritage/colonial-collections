import {clerkClient, auth} from '@clerk/nextjs';

type Community = {
  id: string;
  name: string;
};

export type Membership = {
  id: string;
  role: string;
  publicUserData?: {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string;
  } | null;
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

export function isAdminOf(memberships: Membership[]): boolean {
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
