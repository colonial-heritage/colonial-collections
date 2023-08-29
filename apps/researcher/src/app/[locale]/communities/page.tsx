import {getAllCommunities} from '@/lib/community';
import {getTranslations} from 'next-intl/server';
import ErrorMessage from '@/components/error-message';

// For now this is a basic page without design, just for navigating between communities.
export default async function CommunitiesPage() {
  const t = await getTranslations('Communities');

  let communities;
  try {
    communities = await getAllCommunities();
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  return (
    <>
      <h1>{t('title')}</h1>
      <ul>
        {communities.map(community => (
          <li key={community.id} data-testid="community-item-name">
            <a href={`/communities/${community.id}`}>{community.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
