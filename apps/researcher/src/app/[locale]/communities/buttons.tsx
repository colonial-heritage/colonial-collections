'use client';

import {useCreateCommunity} from '@/lib/community/hooks';
import {useTranslations} from 'next-intl';

export function AddCommunityButton() {
  const {openCreateCommunity} = useCreateCommunity();
  const t = useTranslations('Communities');

  return (
    <button
      onClick={() =>
        openCreateCommunity({
          afterCreateOrganizationUrl: organization =>
            `/revalidate/communities/${organization.slug}/?path=/[locale]/communities`,
        })
      }
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumBlue-800 text-consortiumGreen-300 transition flex items-center gap-1"
    >
      {t('addCommunity')}
    </button>
  );
}
