import {TestInfo} from '@playwright/test';
import {env} from 'node:process';
import {Organization, clerkClient} from '@clerk/clerk-sdk-node';
import {resetDb} from './database';

export function projectTestId(projectName: string) {
  return `${env.TEST_RUN_ID}-${projectName.toLowerCase().replace(/ /g, '-')}`;
}

export function projectTestEmail(projectName: string) {
  return `${projectTestId(projectName)}+clerk_test@example.com`;
}

export async function createTestingUsersAndCommunities(testInfo: TestInfo) {
  await Promise.all(
    getTestProjects(testInfo).map(async p => {
      const user = await createUser(p.name);
      await createCommunity({userId: user.id, projectName: p.name});
    })
  );
}

async function createUser(projectName: string) {
  const testId = projectTestId(projectName);
  return clerkClient.users.createUser({
    firstName: 'TestUser',
    lastName: projectName,
    emailAddress: [projectTestEmail(projectName)],
    password: env.TEST_USER_PASSWORD,
    publicMetadata: {
      iri: `https://example.com/${testId}`,
      description: 'This is a user created for end-to-end testing',
    },
  });
}

async function createCommunity({
  userId,
  projectName,
}: {
  userId: string;
  projectName: string;
}) {
  const testId = projectTestId(projectName);
  return clerkClient.organizations.createOrganization({
    name: `End-2-end Community: ${testId}`,
    slug: testId,
    createdBy: userId,
    publicMetadata: {
      iri: `https://example.com/${testId}`,
      description:
        'This is a community created for end-to-end testing, it will be deleted after the tests are done.',
    },
  });
}

export async function getTestCommunity(slug: string) {
  return clerkClient.organizations.getOrganization({
    slug,
  });
}

export async function getTestUser(communityId: string) {
  const {data: memberships} =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: communityId,
    });
  return memberships[0];
}

export function getTestProjects(testInfo: TestInfo) {
  return testInfo.config.projects.filter(
    p => p.name !== 'global setup' && p.name !== 'cleanup'
  );
}

export async function getAllTestCommunities() {
  const {data: allCommunities} =
    await clerkClient.organizations.getOrganizationList({limit: 1000});

  return allCommunities.filter(c => c.name.includes('End-2-end Community'));
}

export async function deleteCommunityWithData(community: Organization) {
  const {data: memberships} =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: community.id,
    });
  await Promise.all(
    memberships.map(m => {
      if (m.publicUserData?.firstName === 'TestUser') {
        clerkClient.users.deleteUser(m.publicUserData!.userId);
      }
    })
  );
  await resetDb(community.slug!);
  return clerkClient.organizations.deleteOrganization(community.id);
}
