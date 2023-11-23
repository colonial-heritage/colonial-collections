import {describe, expect, it} from '@jest/globals';
import {Organization, OrganizationMembership} from '@clerk/backend/dist/types';
import {OrganizationResource} from '@clerk/types';
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
    license: 'license',
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
  license: 'license',
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
    // @ts-expect-error:TS2740
    const organization: OrganizationResource = {
      id: 'org1',
      name: 'Organization 1',
      publicMetadata: {
        description: 'Description',
        attributionId: 'attributionId',
        license: 'license',
      },
      slug: 'organization-1',
      imageUrl: 'https://example.com/image.png',
      createdAt: new Date(1620000000000),
      membersCount: 10,
    };

    const expectedCommunity: Community = {
      id: 'org1',
      name: 'Organization 1',
      description: 'Description',
      attributionId: 'attributionId',
      license: 'license',
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
