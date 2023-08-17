'use server';

import {clerkClient} from '@clerk/nextjs';

interface Props {
  organizationId: string;
  userId: string;
}

export async function joinCommunity({organizationId, userId}: Props) {
  await clerkClient.organizations.createOrganizationMembership({
    organizationId,
    userId,
    role: 'basic_member',
  });
}
