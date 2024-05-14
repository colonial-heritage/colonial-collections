import {clerkClient} from '@clerk/clerk-sdk-node';
import {resetDb} from './database';

interface CreateUserProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  testId: string;
}

export async function createUser({
  firstName,
  lastName,
  emailAddress,
  password,
  testId,
}: CreateUserProps) {
  return clerkClient.users.createUser({
    firstName,
    lastName,
    emailAddress: [emailAddress],
    password,
    unsafeMetadata: {
      iri: `https://example.com/${testId}`,
    },
  });
}

interface CreateCommunityProps {
  userId: string;
  name: string;
  slug: string;
}

export async function createCommunity({
  userId,
  name,
  slug,
}: CreateCommunityProps) {
  return clerkClient.organizations.createOrganization({
    name,
    slug,
    createdBy: userId,
    publicMetadata: {
      iri: `https://example.com/${slug}`,
      description:
        'This is a community created for end-to-end testing, it will be deleted after the tests are done.',
    },
  });
}

export async function getTestCommunities() {
  const {data: allCommunities} =
    await clerkClient.organizations.getOrganizationList({limit: 1000});

  return allCommunities.filter(c => c.name.includes('End-2-end Community'));
}

export async function deleteCommunityWithData(communityId: string) {
  const {data: memberships} =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: communityId,
    });
  await Promise.all(
    memberships.map(m => {
      if (m.publicUserData?.firstName === 'End-to-end') {
        clerkClient.users.deleteUser(m.publicUserData!.userId);
      }
    })
  );
  await resetDb(communityId);
  return clerkClient.organizations.deleteOrganization(communityId);
}
