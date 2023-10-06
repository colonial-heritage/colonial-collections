import {describe, expect, it} from '@jest/globals';
import {auth} from '@clerk/nextjs';
import {isAdmin, sort, SortBy} from './community';
import {OrganizationMembership} from '@clerk/nextjs/dist/types/server';

const basicOrganization = {
  id: 'organization1',
  name: 'Organization 1',
  slug: 'organization-1',
  imageUrl: 'https://example.com/image.png',
  createdAt: 1690000000000,
  updatedAt: 1690000000000,
  logoUrl: null,
  createdBy: 'me',
  publicMetadata: null,
  privateMetadata: {},
  maxAllowedMemberships: 100,
  adminDeleteEnabled: true,
};

const basicMembership = {
  id: 'membership1',
  role: 'admin',
  publicUserData: {
    identifier: 'me',
    userId: 'me',
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: 'https://example.com/image.png',
    imageUrl: 'https://example.com/image.png',
  },
  publicMetadata: {},
  privateMetadata: {},
  createdAt: 1690000000000,
  updatedAt: 1690000000000,
  organization: basicOrganization,
};

jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn().mockImplementation(() => ({
    userId: 'me',
  })),
}));

describe('isAdmin', () => {
  it('returns true if user is an admin', () => {
    const memberships: ReadonlyArray<OrganizationMembership> = [
      {
        ...basicMembership,
        id: 'membership1',
        role: 'admin',
        publicUserData: {
          ...basicMembership.publicUserData,
          userId: 'me',
        },
      },
      {
        ...basicMembership,
        id: 'membership2',
        role: 'basic_member',
        publicUserData: {
          ...basicMembership.publicUserData,
          userId: 'me',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(true);
  });

  it('returns false if user is not an admin', () => {
    const memberships: ReadonlyArray<OrganizationMembership> = [
      {
        ...basicMembership,
        id: 'membership1',
        role: 'basic_member',
        publicUserData: {
          ...basicMembership.publicUserData,
          userId: 'me',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not a member', () => {
    const memberships: ReadonlyArray<OrganizationMembership> = [
      {
        ...basicMembership,
        id: 'membership1',
        role: 'basic_member',
        publicUserData: {
          ...basicMembership.publicUserData,
          userId: 'notMe',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not logged in', () => {
    (auth as jest.Mock).mockImplementation(() => ({
      userId: undefined,
    }));

    const memberships: ReadonlyArray<OrganizationMembership> = [
      {
        ...basicMembership,
        id: 'membership1',
        role: 'admin',
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if there are no memberships', () => {
    const memberships: OrganizationMembership[] = [];
    expect(isAdmin(memberships)).toEqual(false);
  });
});

describe('sort', () => {
  const communities = [
    {
      ...basicOrganization,
      id: 'community2',
      name: 'Community 2',
      createdAt: 1690000000000,
    },
    {
      ...basicOrganization,
      id: 'community1',
      name: 'Community 1',
      createdAt: 1600000000000,
    },
    {
      ...basicOrganization,
      id: 'community4',
      name: 'Community 4',
      createdAt: 1680000000000,
    },
    {
      ...basicOrganization,
      id: 'community3',
      name: 'Community 3',
      createdAt: 1650000000000,
    },
    {
      ...basicOrganization,
      id: 'community5',
      name: 'Community 5',
      createdAt: 1670000000000,
    },
  ];

  it('sorts communities by name in ascending order', () => {
    const sortedCommunities = sort(communities, SortBy.NameAsc);

    const expectedSortedCommunities = [
      expect.objectContaining({
        id: 'community1',
        name: 'Community 1',
        createdAt: 1600000000000,
      }),
      expect.objectContaining({
        id: 'community2',
        name: 'Community 2',
        createdAt: 1690000000000,
      }),
      expect.objectContaining({
        id: 'community3',
        name: 'Community 3',
        createdAt: 1650000000000,
      }),
      expect.objectContaining({
        id: 'community4',
        name: 'Community 4',
        createdAt: 1680000000000,
      }),
      expect.objectContaining({
        id: 'community5',
        name: 'Community 5',
        createdAt: 1670000000000,
      }),
    ];

    expect(sortedCommunities).toEqual(expectedSortedCommunities);
  });

  it('sorts communities by name in descending order', () => {
    const sortedCommunities = sort(communities, SortBy.NameDesc);

    const expectedSortedCommunities = [
      expect.objectContaining({
        id: 'community5',
        name: 'Community 5',
        createdAt: 1670000000000,
      }),
      expect.objectContaining({
        id: 'community4',
        name: 'Community 4',
        createdAt: 1680000000000,
      }),
      expect.objectContaining({
        id: 'community3',
        name: 'Community 3',
        createdAt: 1650000000000,
      }),
      expect.objectContaining({
        id: 'community2',
        name: 'Community 2',
        createdAt: 1690000000000,
      }),
      expect.objectContaining({
        id: 'community1',
        name: 'Community 1',
        createdAt: 1600000000000,
      }),
    ];

    expect(sortedCommunities).toEqual(expectedSortedCommunities);
  });

  it('sorts communities by creation date in descending order', () => {
    const sortedCommunities = sort(communities, SortBy.CreatedAtDesc);

    const expectedSortedCommunities = [
      expect.objectContaining({
        id: 'community2',
        name: 'Community 2',
        createdAt: 1690000000000,
      }),
      expect.objectContaining({
        id: 'community4',
        name: 'Community 4',
        createdAt: 1680000000000,
      }),
      expect.objectContaining({
        id: 'community5',
        name: 'Community 5',
        createdAt: 1670000000000,
      }),
      expect.objectContaining({
        id: 'community3',
        name: 'Community 3',
        createdAt: 1650000000000,
      }),
      expect.objectContaining({
        id: 'community1',
        name: 'Community 1',
        createdAt: 1600000000000,
      }),
    ];

    expect(sortedCommunities).toEqual(expectedSortedCommunities);
  });

  it('returns the list unsorted if sortBy is an incorrect value', () => {
    const sortedCommunities = sort(communities, 'incorrect' as SortBy);

    expect(sortedCommunities).toEqual(communities);
  });
});
