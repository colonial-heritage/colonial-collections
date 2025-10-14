import {clerkClient} from '@clerk/nextjs/server';
import {createPersistentIri} from '@colonial-collections/iris';
import {unstable_noStore as noStore} from 'next/cache';

export async function getIriOfUser(userId: string) {
  noStore();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} does not exist`);
  }

  let iri = user.unsafeMetadata?.iri as string | undefined;
  if (!iri) {
    iri = createPersistentIri();

    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        iri,
      },
    });
  }
  return iri;
}
