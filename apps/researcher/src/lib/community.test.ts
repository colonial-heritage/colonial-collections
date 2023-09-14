import {describe, expect, it} from '@jest/globals';
import {auth} from '@clerk/nextjs';
import {
  isAdmin,
  Membership,
  sortCommunities,
  CommunitySortBy,
} from './community';

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
        publicUserData: {
          userId: 'me',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
      {
        id: 'membership2',
        role: 'basic_member',
        publicUserData: {
          userId: 'notMe',
          firstName: 'Jane',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(true);
  });

  it('returns false if user is not an admin', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'basic_member',
        publicUserData: {
          userId: 'me',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not a member', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'basic_member',
        publicUserData: {
          userId: 'notMe',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
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
        publicUserData: {
          userId: 'notMe',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if there are no memberships', () => {
    const memberships: Membership[] = [];
    expect(isAdmin(memberships)).toEqual(false);
  });
});

describe('sortCommunities', () => {
  const communities = [
    {
      id: 'community2',
      name: 'Community 2',
      slug: 'community-2',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1690000000000,
    },
    {
      id: 'community1',
      name: 'Community 1',
      slug: 'community-1',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1600000000000,
    },
    {
      id: 'community4',
      name: 'Community 4',
      slug: 'community-4',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1680000000000,
    },
    {
      id: 'community3',
      name: 'Community 3',
      slug: 'community-3',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1650000000000,
    },
    {
      id: 'community5',
      name: 'Community 5',
      slug: 'community-5',
      imageUrl: 'https://example.com/image.png',
      createdAt: 1670000000000,
    },
  ];
  it('sorts communities by name ascending', () => {
    const sortedCommunities = sortCommunities(
      communities,
      CommunitySortBy.NameAsc
    );
    const sortedCommunitiesIds = sortedCommunities.map(
      community => community.id
    );
    expect(sortedCommunitiesIds).toEqual([
      'community1',
      'community2',
      'community3',
      'community4',
      'community5',
    ]);
  });

  it('sorts communities by name descending', () => {
    const sortedCommunities = sortCommunities(
      communities,
      CommunitySortBy.NameDesc
    );
    const sortedCommunitiesIds = sortedCommunities.map(
      community => community.id
    );
    expect(sortedCommunitiesIds).toEqual([
      'community5',
      'community4',
      'community3',
      'community2',
      'community1',
    ]);
  });

  it('sorts communities by creation date descending', () => {
    const sortedCommunities = sortCommunities(
      communities,
      CommunitySortBy.CreatedAtDesc
    );
    const sortedCommunitiesIds = sortedCommunities.map(
      community => community.id
    );
    expect(sortedCommunitiesIds).toEqual([
      'community2',
      'community4',
      'community5',
      'community3',
      'community1',
    ]);
  });

  it('works with an empty array', () => {
    const sortedCommunities = sortCommunities([], CommunitySortBy.NameAsc);
    expect(sortedCommunities).toEqual([]);
  });

  it('returns the list unsorted if sortBy is an incorrect value', () => {
    const sortedCommunities = sortCommunities(
      communities,
      'incorrect' as CommunitySortBy
    );
    const sortedCommunitiesIds = sortedCommunities.map(
      community => community.id
    );
    expect(sortedCommunitiesIds).toEqual([
      'community2',
      'community1',
      'community4',
      'community3',
      'community5',
    ]);
  });
});
