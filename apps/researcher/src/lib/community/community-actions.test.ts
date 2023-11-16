import {describe, expect, it} from '@jest/globals';
import {auth} from '@clerk/nextjs';
import {isAdmin, sort} from './community-actions';
import {Membership, SortBy} from './definitions';

jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn().mockImplementation(() => ({
    userId: 'me',
  })),
}));

describe('isAdmin', () => {
  it('returns true if user is an admin', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'admin',
        userId: 'me',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
      },
      {
        id: 'membership2',
        role: 'basic_member',
        userId: 'notMe',
        firstName: 'Jane',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
      },
    ];
    expect(isAdmin(memberships)).toEqual(true);
  });

  it('returns false if user is not an admin', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'basic_member',
        userId: 'me',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not a member', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'basic_member',
        userId: 'notMe',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not logged in', () => {
    (auth as jest.Mock).mockImplementation(() => ({
      userId: undefined,
    }));

    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'admin',
        userId: 'notMe',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/image.png',
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if there are no memberships', () => {
    const memberships: Membership[] = [];
    expect(isAdmin(memberships)).toEqual(false);
  });
});

describe('sort', () => {
  const communities = [
    {
      id: 'community2',
      name: 'Community 2',
      slug: 'community-2',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1690000000000,
      membershipCount: 10,
      canAddEnrichments: false,
    },
    {
      id: 'community1',
      name: 'Community 1',
      slug: 'community-1',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1600000000000,
      membershipCount: 5,
      canAddEnrichments: false,
    },
    {
      id: 'community4',
      name: 'Community 4',
      slug: 'community-4',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1680000000000,
      membershipCount: 15,
      canAddEnrichments: false,
    },
    {
      id: 'community3',
      name: 'Community 3',
      slug: 'community-3',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1650000000000,
      membershipCount: 20,
      canAddEnrichments: false,
    },
    {
      id: 'community5',
      name: 'Community 5',
      slug: 'community-5',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1670000000000,
      membershipCount: undefined,
      canAddEnrichments: false,
    },
  ];

  it('sorts communities by name in ascending order', () => {
    const sortedCommunities = sort(communities, SortBy.NameAsc);

    const expectedSortedCommunities = [
      {
        id: 'community1',
        name: 'Community 1',
        slug: 'community-1',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1600000000000,
        membershipCount: 5,
        canAddEnrichments: false,
      },
      {
        id: 'community2',
        name: 'Community 2',
        slug: 'community-2',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1690000000000,
        membershipCount: 10,
        canAddEnrichments: false,
      },
      {
        id: 'community3',
        name: 'Community 3',
        slug: 'community-3',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1650000000000,
        membershipCount: 20,
        canAddEnrichments: false,
      },
      {
        id: 'community4',
        name: 'Community 4',
        slug: 'community-4',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1680000000000,
        membershipCount: 15,
        canAddEnrichments: false,
      },
      {
        id: 'community5',
        name: 'Community 5',
        slug: 'community-5',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1670000000000,
        membershipCount: undefined,
        canAddEnrichments: false,
      },
    ];

    expect(sortedCommunities).toStrictEqual(expectedSortedCommunities);
  });

  it('sorts communities by name in descending order', () => {
    const sortedCommunities = sort(communities, SortBy.NameDesc);

    const expectedSortedCommunities = [
      {
        id: 'community5',
        name: 'Community 5',
        slug: 'community-5',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1670000000000,
        membershipCount: undefined,
        canAddEnrichments: false,
      },
      {
        id: 'community4',
        name: 'Community 4',
        slug: 'community-4',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1680000000000,
        membershipCount: 15,
        canAddEnrichments: false,
      },
      {
        id: 'community3',
        name: 'Community 3',
        slug: 'community-3',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1650000000000,
        membershipCount: 20,
        canAddEnrichments: false,
      },
      {
        id: 'community2',
        name: 'Community 2',
        slug: 'community-2',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1690000000000,
        membershipCount: 10,
        canAddEnrichments: false,
      },
      {
        id: 'community1',
        name: 'Community 1',
        slug: 'community-1',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1600000000000,
        membershipCount: 5,
        canAddEnrichments: false,
      },
    ];

    expect(sortedCommunities).toStrictEqual(expectedSortedCommunities);
  });

  it('sorts communities by creation date in descending order', () => {
    const sortedCommunities = sort(communities, SortBy.CreatedAtDesc);

    const expectedSortedCommunities = [
      {
        id: 'community2',
        name: 'Community 2',
        slug: 'community-2',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1690000000000,
        membershipCount: 10,
        canAddEnrichments: false,
      },
      {
        id: 'community4',
        name: 'Community 4',
        slug: 'community-4',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1680000000000,
        membershipCount: 15,
        canAddEnrichments: false,
      },
      {
        id: 'community5',
        name: 'Community 5',
        slug: 'community-5',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1670000000000,
        membershipCount: undefined,
        canAddEnrichments: false,
      },
      {
        id: 'community3',
        name: 'Community 3',
        slug: 'community-3',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1650000000000,
        membershipCount: 20,
        canAddEnrichments: false,
      },
      {
        id: 'community1',
        name: 'Community 1',
        slug: 'community-1',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1600000000000,
        membershipCount: 5,
        canAddEnrichments: false,
      },
    ];

    expect(sortedCommunities).toStrictEqual(expectedSortedCommunities);
  });

  it('sorts communities by membership count in descending order', () => {
    const sortedCommunities = sort(communities, SortBy.MembershipCountDesc);

    const expectedSortedCommunities = [
      {
        id: 'community3',
        name: 'Community 3',
        slug: 'community-3',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1650000000000,
        membershipCount: 20,
        canAddEnrichments: false,
      },
      {
        id: 'community4',
        name: 'Community 4',
        slug: 'community-4',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1680000000000,
        membershipCount: 15,
        canAddEnrichments: false,
      },
      {
        id: 'community2',
        name: 'Community 2',
        slug: 'community-2',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1690000000000,
        membershipCount: 10,
        canAddEnrichments: false,
      },
      {
        id: 'community1',
        name: 'Community 1',
        slug: 'community-1',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1600000000000,
        membershipCount: 5,
        canAddEnrichments: false,
      },
      {
        id: 'community5',
        name: 'Community 5',
        slug: 'community-5',
        imageUrl: 'https://example.com/image.png',
        createdAt: 1670000000000,
        membershipCount: undefined,
        canAddEnrichments: false,
      },
    ];

    expect(sortedCommunities).toStrictEqual(expectedSortedCommunities);
  });

  it('returns the original array if sortBy is not valid', () => {
    const sortedCommunities = sort(communities, 'invalid' as SortBy);

    expect(sortedCommunities).toStrictEqual(communities);
  });
});
