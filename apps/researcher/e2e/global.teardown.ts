import {test as teardown} from '@playwright/test';
import {
  deleteCommunityWithData,
  getAllTestCommunities,
  getTestCommunity,
  getTestProjects,
  projectTestId,
} from './lib/community';

teardown(
  'Delete test communities with users and data',
  // eslint-disable-next-line no-empty-pattern
  async ({}, testInfo) => {
    await Promise.all(
      getTestProjects(testInfo).map(async project => {
        const community = await getTestCommunity(projectTestId(project.name));
        return deleteCommunityWithData(community);
      })
    );

    // Sometimes the teardown is not run, check for testing communities older than 1 hour, and delete them
    const allTestCommunities = await getAllTestCommunities();
    await Promise.all(
      allTestCommunities
        .filter(c => c.createdAt < Date.now() - 60 * 60 * 1000)
        .map(deleteCommunityWithData)
    );
  }
);
