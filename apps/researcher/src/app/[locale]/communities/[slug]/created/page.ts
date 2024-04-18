import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {createPersistentIri} from '@colonial-collections/iris';
import {getCommunityBySlug, addIriToCommunity} from '@/lib/community/actions';

interface Props {
  params: {
    slug: string;
  };
}

export default async function CommunityCreated({params}: Props) {
  // Revalidate the communities page to show the new community.
  revalidatePath('/[locale]/communities', 'page');

  const community = await getCommunityBySlug(params.slug);

  const iri = createPersistentIri();

  await addIriToCommunity({
    id: community.id,
    iri,
  });

  redirect(`/communities/${params.slug}`);
}
