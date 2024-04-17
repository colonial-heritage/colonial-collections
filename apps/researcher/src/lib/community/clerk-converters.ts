import {Organization, OrganizationMembership} from '@clerk/backend/dist/types';
import {OrganizationResource} from '@clerk/types';
import {Community, Membership} from './definitions';

// This function can be used by both frontend and backend code.
// Frontend code can use the Clerk type `OrganizationResource`.
// Backend code can use the Clerk type `Organization`.
// To simplify the code we return the same `Community` type for both.
export function organizationToCommunity(
  organization: Organization | OrganizationResource
): Community {
  return {
    id: organization.id,
    name: organization.name,
    // The type of `publicMetadata` is `{ [k: string]: unknown } | null `. Redeclare custom metadata.
    description: organization.publicMetadata?.description as string | undefined,
    iri: organization.publicMetadata?.iri as string | undefined,
    slug: organization.slug!,
    imageUrl: organization.imageUrl,
    // In OrganizationResource `createdAt` is a `Date` object.
    // In Organization `createdAt` is a number.
    // Convert both to a number.
    // We are only using the date for sorting.
    // Also a date object cannot be passed from a server to a client component.
    createdAt:
      organization.createdAt instanceof Date
        ? organization.createdAt.getTime()
        : organization.createdAt,
    membershipCount:
      'members_count' in organization // Organization
        ? organization.members_count
        : 'membersCount' in organization // OrganizationResource
          ? organization.membersCount
          : undefined,
  };
}

export function organizationMembershipToCommunityMembership(
  membership: OrganizationMembership
): Membership {
  // There are some assumptions made in this function:
  // - The membership has a `publicUserData` field. Even though it is optional in the Clerk type `OrganizationMembership`.
  // - The `publicUserData` has the fields `userId` and `imageUrl`.
  // - The `publicUserData` has the fields `firstName` and `lastName`.
  //   These are optional in the Clerk type `OrganizationMembershipPublicUserData` but set to required in the Clerk settings for this application.

  return {
    id: membership.id,
    role: membership.role,
    userId: membership.publicUserData!.userId,
    firstName: membership.publicUserData!.firstName!,
    lastName: membership.publicUserData!.lastName!,
    imageUrl: membership.publicUserData!.imageUrl,
  };
}
