import {describe, expect, it} from '@jest/globals';
import {Organization, OrganizationMembership} from '@clerk/backend/dist/types';
import {
  ClerkPaginatedResponse,
  GetMembersParams,
  GetMembershipsParams,
  OrganizationDomainResource,
  OrganizationInvitationResource,
  OrganizationMembershipRequestResource,
  OrganizationMembershipResource,
  OrganizationResource,
} from '@clerk/types';
import {Community, Membership} from './definitions';
import {
  organizationMembershipToCommunityMembership,
  organizationToCommunity,
} from './clerk-converters';

const organization: Organization = {
  id: 'org1',
  name: 'Organization 1',
  publicMetadata: {
    description: 'Description',
    attributionId: 'attributionId',
    licence: 'licence',
  },
  slug: 'organization-1',
  imageUrl: 'https://example.com/image.png',
  createdAt: 1620000000000,
  updatedAt: 1620000000000,
  members_count: 10,
  logoUrl: 'https://example.com/logo.png',
  hasImage: true,
  createdBy: 'user1',
  privateMetadata: {},
  maxAllowedMemberships: 100,
  adminDeleteEnabled: true,
};

const expectedCommunity: Community = {
  id: 'org1',
  name: 'Organization 1',
  description: 'Description',
  attributionId: 'attributionId',
  licence: 'licence',
  slug: 'organization-1',
  imageUrl: 'https://example.com/image.png',
  createdAt: 1620000000000,
  membershipCount: 10,
  canAddEnrichments: true,
};

describe('organizationToCommunity', () => {
  it('converts an Organization to a Community', () => {
    expect(organizationToCommunity(organization)).toEqual(expectedCommunity);
  });

  it('converts an OrganizationResource to a Community', () => {
    const organization: OrganizationResource = {
      id: 'org1',
      name: 'Organization 1',
      publicMetadata: {
        description: 'Description',
        attributionId: 'attributionId',
        licence: 'licence',
      },
      slug: 'organization-1',
      imageUrl: 'https://example.com/image.png',
      createdAt: new Date(1620000000000),
      logoUrl: null,
      hasImage: false,
      membersCount: 10,
      pendingInvitationsCount: 0,
      adminDeleteEnabled: false,
      maxAllowedMemberships: 0,
      updatedAt: new Date(1620000000000),
      update: function (): Promise<OrganizationResource> {
        throw new Error('Function not implemented.');
      },
      getMemberships: function <
        T extends (GetMembershipsParams | GetMembersParams) & {
          paginated?: boolean | undefined;
        },
      >(): T['paginated'] extends true
        ? Promise<ClerkPaginatedResponse<OrganizationMembershipResource>>
        : Promise<OrganizationMembershipResource[]> {
        throw new Error('Function not implemented.');
      },
      getPendingInvitations: function (): Promise<
        OrganizationInvitationResource[]
      > {
        throw new Error('Function not implemented.');
      },
      getInvitations: function (): Promise<
        ClerkPaginatedResponse<OrganizationInvitationResource>
      > {
        throw new Error('Function not implemented.');
      },
      getDomains: function (): Promise<
        ClerkPaginatedResponse<OrganizationDomainResource>
      > {
        throw new Error('Function not implemented.');
      },
      getMembershipRequests: function (): Promise<
        ClerkPaginatedResponse<OrganizationMembershipRequestResource>
      > {
        throw new Error('Function not implemented.');
      },
      addMember: function (): Promise<OrganizationMembershipResource> {
        throw new Error('Function not implemented.');
      },
      inviteMember: function (): Promise<OrganizationInvitationResource> {
        throw new Error('Function not implemented.');
      },
      inviteMembers: function (): Promise<OrganizationInvitationResource[]> {
        throw new Error('Function not implemented.');
      },
      updateMember: function (): Promise<OrganizationMembershipResource> {
        throw new Error('Function not implemented.');
      },
      removeMember: function (): Promise<OrganizationMembershipResource> {
        throw new Error('Function not implemented.');
      },
      createDomain: function (): Promise<OrganizationDomainResource> {
        throw new Error('Function not implemented.');
      },
      getDomain: function (): Promise<OrganizationDomainResource> {
        throw new Error('Function not implemented.');
      },
      destroy: function (): Promise<void> {
        throw new Error('Function not implemented.');
      },
      setLogo: function (): Promise<OrganizationResource> {
        throw new Error('Function not implemented.');
      },
      pathRoot: '',
      reload: function (): Promise<OrganizationResource> {
        throw new Error('Function not implemented.');
      },
    };

    const expectedCommunity: Community = {
      id: 'org1',
      name: 'Organization 1',
      description: 'Description',
      attributionId: 'attributionId',
      licence: 'licence',
      slug: 'organization-1',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1620000000000,
      membershipCount: 10,
      canAddEnrichments: true,
    };

    expect(organizationToCommunity(organization)).toEqual(expectedCommunity);
  });
});

describe('organizationMembershipToCommunityMembership', () => {
  it('converts an OrganizationMembership to a Membership', () => {
    const membership: OrganizationMembership = {
      id: 'membership1',
      role: 'admin',
      publicUserData: {
        userId: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
        identifier: '',
        profileImageUrl: '',
        hasImage: false,
      },
      privateMetadata: {},
      publicMetadata: {},
      createdAt: 0,
      updatedAt: 0,
      organization,
    };

    const expectedMembership: Membership = {
      id: 'membership1',
      role: 'admin',
      userId: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'https://example.com/image.png',
    };

    expect(organizationMembershipToCommunityMembership(membership)).toEqual(
      expectedMembership
    );
  });
});
