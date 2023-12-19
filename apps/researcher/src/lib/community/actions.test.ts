import {describe, expect, it} from '@jest/globals';
import {sort} from './actions';
import {SortBy} from './definitions';

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
