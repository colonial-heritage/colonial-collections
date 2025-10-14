import {describe, expect, it} from '@jest/globals';
import {Organization, OrganizationMembership} from '@clerk/nextjs/server';
import {OrganizationResource} from '@clerk/types';
import {Community, Membership} from './definitions';
import {
  organizationMembershipToCommunityMembership,
  organizationToCommunity,
} from './clerk-converters';

// Test mock organization (backend/server type) with only the properties used by the converter function
// Using double type assertion because Clerk types have many internal properties we don't need for testing
const serverOrganization = {
  id: 'org1',
  name: 'Organization 1',
  publicMetadata: {
    description: 'Description',
    license: 'license',
  },
  slug: 'organization-1',
  imageUrl: 'https://example.com/image.png',
  createdAt: 1620000000000,
  membersCount: 10,
} as unknown as Organization;

// Test mock organization (frontend/client type)
const clientOrganization = {
  id: 'org1',
  name: 'Organization 1',
  publicMetadata: {
    description: 'Description',
    license: 'license',
  },
  slug: 'organization-1',
  imageUrl: 'https://example.com/image.png',
  createdAt: new Date(1620000000000),
  membersCount: 10,
} as unknown as OrganizationResource;

const expectedCommunity: Community = {
  id: 'org1',
  name: 'Organization 1',
  description: 'Description',
  slug: 'organization-1',
  imageUrl: 'https://example.com/image.png',
  createdAt: 1620000000000,
  membershipCount: 10,
};

describe('organizationToCommunity', () => {
  it('converts a server-side Organization to a Community', () => {
    expect(organizationToCommunity(serverOrganization)).toEqual(
      expectedCommunity
    );
  });

  it('converts a client-side OrganizationResource to a Community', () => {
    // Client organization has Date object for createdAt, but converter should normalize to number
    expect(organizationToCommunity(clientOrganization)).toEqual(
      expectedCommunity
    );
  });

  it('handles missing optional properties gracefully', () => {
    const minimalOrg = {
      id: 'org2',
      name: 'Minimal Org',
      slug: 'minimal-org',
      createdAt: 1620000000000,
      membersCount: 5,
      // Missing: publicMetadata, imageUrl
    } as unknown as Organization;

    const result = organizationToCommunity(minimalOrg);

    expect(result).toEqual({
      id: 'org2',
      name: 'Minimal Org',
      description: undefined, // Should handle missing description gracefully
      iri: undefined, // Should handle missing iri gracefully
      slug: 'minimal-org',
      imageUrl: undefined, // Should handle missing imageUrl gracefully
      createdAt: 1620000000000,
      membershipCount: 5,
    });
  });

  it('handles null publicMetadata gracefully', () => {
    const orgWithNullMetadata = {
      id: 'org3',
      name: 'Org with null metadata',
      publicMetadata: null,
      slug: 'null-metadata-org',
      createdAt: 1620000000000,
      membersCount: 0,
    } as unknown as Organization;

    const result = organizationToCommunity(orgWithNullMetadata);

    expect(result.description).toBeUndefined();
    expect(result.iri).toBeUndefined();
  });
});

describe('organizationMembershipToCommunityMembership', () => {
  it('converts an OrganizationMembership to a Membership', () => {
    // Test mock membership with only the properties used by the converter function
    const membership = {
      id: 'membership1',
      role: 'admin',
      publicUserData: {
        userId: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
        identifier: 'john.doe@example.com',
        hasImage: true,
      },
      privateMetadata: {},
      publicMetadata: {},
      createdAt: 1620000000000,
      updatedAt: 1620000000000,
      organization: serverOrganization,
    } as unknown as OrganizationMembership;

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

  it('handles different role types correctly', () => {
    const memberMembership = {
      id: 'membership2',
      role: 'basic_member',
      publicUserData: {
        userId: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        imageUrl: 'https://example.com/jane.png',
        identifier: 'jane.smith@example.com',
        hasImage: true,
      },
      organization: serverOrganization,
    } as unknown as OrganizationMembership;

    const result =
      organizationMembershipToCommunityMembership(memberMembership);

    expect(result.role).toBe('basic_member');
    expect(result.userId).toBe('user2');
    expect(result.firstName).toBe('Jane');
    expect(result.lastName).toBe('Smith');
  });
});
