'use server';

import {joinCommunity, updateDescription} from '@/lib/community';
import {revalidatePath} from 'next/cache';

interface UpdateDescriptionActionProps {
  communityId: string;
  communitySlug: string;
  description: string;
}

export async function updateDescriptionAction({
  communityId,
  communitySlug,
  description,
}: UpdateDescriptionActionProps) {
  await updateDescription({communityId, description});
  revalidatePath(`/[locale]/communities/${communitySlug}`, 'page');
  revalidatePath('/[locale]/communities', 'page');
}

// Export as server actions.
export {joinCommunity};
