import {createPersistentIri} from '@colonial-collections/iris';
import {unstable_noStore as noStore} from 'next/cache';
import {clerkClient} from '@clerk/nextjs';

export default async function IriCheckPage() {
  noStore(); // Disable caching to prevent double updates

  let updated = 0;
  const users = await clerkClient.users.getUserList({
    orderBy: '-created_at',
    limit: 200,
  });

  await Promise.all(
    users.map(async user => {
      if (!user.unsafeMetadata?.iri) {
        const iri = createPersistentIri();
        await clerkClient.users.updateUser(user.id, {
          unsafeMetadata: {
            ...user.unsafeMetadata,
            iri,
          },
        });
        updated += 1;
      }
    })
  );

  if (updated > 0) {
    console.log(`IRI Check: ${updated} users updated`);
  }

  return (
    <div>
      <h1>IRI Check</h1>
      <p>{updated} user(s) updated.</p>
    </div>
  );
}
