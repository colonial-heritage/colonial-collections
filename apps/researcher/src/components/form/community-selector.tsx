'use client';

import {useUserCommunities} from '@/lib/community/hooks';
import {Select} from './select';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';

export function CommunitySelector() {
  const {communities, isLoaded: communitiesLoaded} = useUserCommunities();
  const t = useTranslations('CommunitySelector');

  const communityOptions = useMemo(() => {
    return communities
      .filter(community => community.iri)
      .map(community => ({
        id: community.iri!,
        name: community.name,
      }));
  }, [communities]);

  if (communitiesLoaded && communities.length === 0) {
    return <div className="text-neutral-500">{t('noCommunities')}</div>;
  }

  return (
    <Select
      name="community"
      options={communityOptions}
      placeholder={
        communitiesLoaded ? t('communityPlaceholder') : t('communitiesLoading')
      }
      disabled={!communitiesLoaded}
    />
  );
}
