'use client';

import {useCreateCommunity} from '@/lib/community/hooks';
import {useTranslations} from 'next-intl';

export function AddCommunityButton() {
  const {openCreateCommunity} = useCreateCommunity();
  const t = useTranslations('Communities');

  return (
    <button
      data-testid="add-community"
      onClick={() =>
        openCreateCommunity({
          // Skip the invitation screen, this is needed because the invitation screen can be closed.
          // If the user closes the invitation screen the `afterCreateOrganizationUrl` won't be called.
          skipInvitationScreen: true,
          afterCreateOrganizationUrl: organization =>
            `/communities/${organization.slug}/created`,
        })
      }
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumBlue-800 text-consortiumGreen-300 transition flex items-center gap-1"
    >
      {t('addCommunity')}
    </button>
  );
}
