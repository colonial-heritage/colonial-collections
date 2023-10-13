'use server';

import {joinCommunity, updateDescription} from '@/lib/community';
import {revalidatePath} from 'next/cache';

interface UpdateDescriptionAndRevalidateProps {
  communityId: string;
  communitySlug: string;
  description: string;
}

export async function updateDescriptionAndRevalidate({
  communityId,
  communitySlug,
  description,
}: UpdateDescriptionAndRevalidateProps) {
  await updateDescription({communityId, description});
  revalidatePath(`/[locale]/communities/${communitySlug}`, 'page');
  revalidatePath('/[locale]/communities', 'page');
}

interface JoinCommunityAndRevalidateProps {
  communityId: string;
  communitySlug: string;
  userId: string;
}

export async function joinCommunityAndRevalidate({
  communityId,
  communitySlug,
  userId,
}: JoinCommunityAndRevalidateProps) {
  await joinCommunity({communityId, userId});
  revalidatePath(`/[locale]/communities/${communitySlug}`, 'page');
  revalidatePath('/[locale]/communities', 'page');
}
