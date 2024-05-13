import {clerkSetup} from '@clerk/testing/playwright';
import {test as setup} from '@playwright/test';
import {deleteCommunityWithData, getAllTestCommunities} from './lib/community';

setup('global setup', async () => {
  await clerkSetup();

  // Testing accounts are created for each test worker, and are deleted after the tests are done.
  // In case the tests are interrupted, the accounts might not be deleted.
  // Just to be sure, check for old testing accounts, and delete them.
  // This is not needed for successful test runs, it's just for keeping a clean testing environment.
  const allTestCommunities = await getAllTestCommunities();
  await Promise.all(
    allTestCommunities
      .filter(community => community.createdAt < Date.now() - 60 * 60 * 1000)
      .map(community => deleteCommunityWithData(community.id))
  );
});
