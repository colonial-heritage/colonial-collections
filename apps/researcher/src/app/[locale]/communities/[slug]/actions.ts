'use server';

import {joinCommunity, updateCommunity} from '@/lib/community';
import {revalidatePath} from 'next/cache';

interface UpdateDescriptionAndRevalidateProps {
  communityId: string;
  name: string;
  slug: string;
  description: string;
  orcid: string;
}

export async function updateCommunityAndRevalidate({
  communityId,
  name,
  slug,
  description,
  orcid,
}: UpdateDescriptionAndRevalidateProps) {
  const community = await updateCommunity({
    communityId,
    description,
    slug,
    name,
    orcid,
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
