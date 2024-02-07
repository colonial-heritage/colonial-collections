'use server';

import {joinCommunity, updateCommunity} from '@/lib/community/actions';
import {revalidatePath} from 'next/cache';

interface UpdateCommunityAndRevalidateProps {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export async function updateCommunityAndRevalidate({
  id,
  name,
  slug,
  description,
}: UpdateCommunityAndRevalidateProps) {
  const community = await updateCommunity({
    id,
    description,
    name,
  });

  revalidatePath(`/[locale]/communities/${slug}`, 'page');
  revalidatePath('/[locale]/communities', 'page');

  return community;
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
