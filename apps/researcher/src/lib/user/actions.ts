import {clerkClient} from '@clerk/nextjs';
import {createPersistentIri} from '@colonial-collections/iris';
import {unstable_noStore as noStore} from 'next/cache';

export async function getOrSetIri(userId: string) {
  noStore();
  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} does not exist`);
  }

  let iri = user.unsafeMetadata?.iri as string | undefined;
  if (!iri) {
    iri = createPersistentIri();

    await clerkClient.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        iri,
      },
    });
  }
  return iri;
}
