import {clerkSetup} from '@clerk/testing/playwright';
import {test as setup} from '@playwright/test';
import {env} from 'node:process';
import crypto from 'node:crypto';
import {createTestingUsersAndCommunities} from './lib/community';

// eslint-disable-next-line no-empty-pattern
setup('global setup', async ({}, testInfo) => {
  env.TEST_RUN_ID = crypto.randomUUID();
  env.TEST_RUN_USER_PASSWORD = crypto.randomUUID();
  await createTestingUsersAndCommunities(testInfo);
  await clerkSetup();
});
