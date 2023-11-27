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
            `/revalidate/?path=/[locale]/communities&redirect=/communities/${organization.slug}`,
        })
      }
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
    >
      {t('addCommunity')}
    </button>
  );
}
