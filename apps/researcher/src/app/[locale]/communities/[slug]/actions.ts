'use server';

import {joinCommunity, editDescription} from '@/lib/community';
import {revalidatePath} from 'next/cache';

interface editDescriptionActionProps {
  communityId: string;
  communitySlug: string;
  description: string;
}

async function editDescriptionAction({
  communityId,
  communitySlug,
  description,
}: editDescriptionActionProps) {
  await editDescription({communityId, description});
  revalidatePath(`/[locale]/communities/${communitySlug}`, 'page');
  revalidatePath('/[locale]/communities', 'page');
}

// Export as server actions.
export {joinCommunity, editDescriptionAction};
