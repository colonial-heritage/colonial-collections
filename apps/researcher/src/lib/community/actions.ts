import {clerkClient, auth} from '@clerk/nextjs/server';
import {unstable_noStore as noStore} from 'next/cache';
import {
  organizationMembershipToCommunityMembership,
  organizationToCommunity,
} from './clerk-converters';
import {Community, SortBy} from './definitions';

export async function getCommunityBySlug(slug: string) {
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    slug,
  });

  return organizationToCommunity(organization);
}

export async function getCommunityById(id: string) {
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: id,
  });

  return organizationToCommunity(organization);
}

export async function getMemberships(communityId: string) {
  const client = await clerkClient();
  const organizationMembership =
    await client.organizations.getOrganizationMembershipList({
      organizationId: communityId,
    });

  return organizationMembership.data.map(
    organizationMembershipToCommunityMembership
  );
}

export const defaultSortBy = SortBy.CreatedAtDesc;

export function sort(communities: Community[], sortBy: SortBy) {
  return [...communities].sort((a, b) => {
    if (sortBy === SortBy.NameAsc) {
      return a.name.localeCompare(b.name);
    } else if (sortBy === SortBy.NameDesc) {
      return b.name.localeCompare(a.name);
    } else if (sortBy === SortBy.CreatedAtDesc) {
      return b.createdAt - a.createdAt;
    } else if (sortBy === SortBy.MembershipCountDesc) {
      return (b.membershipCount ?? 0) - (a.membershipCount ?? 0);
    } else {
      return 0;
    }
  });
}

interface GetCommunitiesProps {
  query?: string;
  sortBy?: SortBy;
  limit?: number;
  offset?: number;
  includeMembersCount?: boolean;
}

export async function getCommunities({
  query = '',
  sortBy = defaultSortBy,
  limit,
  offset = 0,
  includeMembersCount = false,
}: GetCommunitiesProps = {}) {
  const client = await clerkClient();
  const {data: organizations} = await client.organizations.getOrganizationList({
    limit,
    offset,
    query,
    includeMembersCount,
  });

  const communities = organizations.map(organizationToCommunity);

  return sort(communities, sortBy);
}

export async function getMyCommunities({
  sortBy = defaultSortBy,
  limit,
  offset = 0,
  includeMembersCount = false,
}: GetCommunitiesProps = {}) {
  noStore();
  const {userId} = await auth();

  if (!userId) {
    console.error('`getMyCommunities()` called without a user');
    return [];
  }

  const memberships = userId
    ? await clerkClient().then(client =>
        client.users.getOrganizationMembershipList({
          userId,
          limit,
          offset,
        })
      )
    : {data: [], totalCount: 0};

  const organizations = memberships.data.map(
    membership => membership.organization
  );

  const communities = await Promise.all(
    organizations.map(async organization => {
      if (includeMembersCount) {
        try {
          const client = await clerkClient();
          const members =
            await client.organizations.getOrganizationMembershipList({
              organizationId: organization.id,
            });
          const organizationWithCount = {
            ...organization,
            membersCount: members.data.length,
          } as typeof organization & {membersCount: number};
          return organizationToCommunity(organizationWithCount);
        } catch (err) {
          console.error('Error fetching members count', err);
          return organizationToCommunity(organization);
        }
      }
      return organizationToCommunity(organization);
    })
  );

  return sort(communities, sortBy);
}

interface JoinCommunityProps {
  communityId: string;
  userId: string;
}

export async function joinCommunity({communityId, userId}: JoinCommunityProps) {
  const client = await clerkClient();
  await client.organizations.createOrganizationMembership({
    organizationId: communityId,
    userId,
    role: 'basic_member',
  });
}

interface UpdateCommunityProps {
  id: string;
  name: string;
  description: string;
}

export async function updateCommunity({
  id,
  name,
  description,
}: UpdateCommunityProps) {
  const client = await clerkClient();
  await client.organizations.updateOrganization(id, {
    name,
    publicMetadata: {
      description,
    },
  });
}

interface UpdateCommunityIriProps {
  id: string;
  iri: string;
}

export async function addIriToCommunity({id, iri}: UpdateCommunityIriProps) {
  noStore();

  const community = await getCommunityById(id);

  // Only add the IRI if it is not already set
  if (!community.iri) {
    const client = await clerkClient();
    const organization = await client.organizations.updateOrganizationMetadata(
      id,
      {
        publicMetadata: {
          iri,
        },
      }
    );
    return organizationToCommunity(organization);
  }
  return community;
}
