import {clerkClient} from '@clerk/nextjs';
import {getTranslations} from 'next-intl/server';

// For now this is a basic page without design, just for navigating between communities.
export default async function CommunitiesPage() {
  const organizations = await clerkClient.organizations.getOrganizationList();
  const t = await getTranslations('Communities');

  return (
    <>
      <h1>{t('title')}</h1>
      <ul>
        {organizations.map(organization => (
          <li key={organization.id}>
            <a href={`/communities/${organization.id}`}>{organization.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
