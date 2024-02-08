'use server';

import {clerkClient} from '@clerk/nextjs';
import {unstable_noStore as noStore} from 'next/cache';

interface AddAttributionIdProps {
  userId: string;
  attributionId: string;
}

export async function addAttributionId({
  userId,
  attributionId,
}: AddAttributionIdProps) {
  noStore();

  if (!userId) {
    throw new Error('userId is required');
  }

  const user = await clerkClient.users.getUser(userId);

  const existingAttributionIds =
    (user.publicMetadata?.attributionIds as string[]) || [];

  // Save all used attributionIds in the user's metadata,
  // so we can query for them later.
  const newAttributionIds = Array.from(
    new Set([...existingAttributionIds, attributionId])
  );

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      attributionIds: newAttributionIds,
    },
  });
}
