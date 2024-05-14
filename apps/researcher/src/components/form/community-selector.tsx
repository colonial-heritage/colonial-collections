'use client';

import {useUser} from '@/lib/user/hooks';
import {Select} from './select';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';

export function CommunitySelector() {
  const {user, isLoaded: communitiesLoaded} = useUser();
  const t = useTranslations('CommunitySelector');

  const communityOptions = useMemo(() => {
    return (
      user?.communityMemberships
        .filter(memberships => memberships.community.iri)
        .map(memberships => ({
          id: memberships.community.iri!,
          name: memberships.community.name,
        })) ?? []
    );
  }, [user]);

  if (communitiesLoaded && communityOptions.length === 0) {
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
