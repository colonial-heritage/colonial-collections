'use client';

import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
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
          afterCreateOrganizationUrl: organization =>
            `/revalidate/?path=${encodeRouteSegment(
              '/[locale]/communities'
            )}&redirect=${encodeRouteSegment(
              `/communities/${organization.slug}`
            )}`,
        })
      }
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumBlue-800 text-consortiumGreen-300 transition flex items-center gap-1"
    >
      {t('addCommunity')}
    </button>
  );
}
