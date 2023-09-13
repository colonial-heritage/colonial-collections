import {Community, getMemberships} from '@/lib/community';
import {getTranslator} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import {Suspense} from 'react';

interface MembershipCountProps {
  communityId: string;
  locale: string;
}

// TODO: This is a workaround for the fact that `includeMembersCount` does not work.
// See comment in `community.ts` for more information.
async function MembershipCount({communityId, locale}: MembershipCountProps) {
  const t = await getTranslator(locale, 'Communities');
  const memberships = await getMemberships(communityId);

  return t.rich('membershipCount', {
    count: `${memberships.length}`,
  });
}

interface CommunityCardProps {
  community: Community;
  locale: string;
}

export default function CommunityCard({community, locale}: CommunityCardProps) {
  const t = useTranslations('Communities');

  return (
    <Link
      href={`/communities/${community.slug}`}
      data-testid="community-item-name"
      className="rounded-lg mb-20 bg-[#f3eee2] hover:bg-[#f1e9d7] text-stone-800 transition"
    >
      <div className="-mt-20 w-full flex justify-center">
        <Image
          width={144}
          height={144}
          src={community.imageUrl}
          alt=""
          className="rounded-full"
        />
      </div>

      <h1 className="text-xl font-normal w-full flex justify-center mt-4 px-4">
        {t.rich('communityName', {
          name: () => (
            <strong className="font-semibold ml-1">{community.name}</strong>
          ),
        })}
      </h1>
      <div className="text-center p-4">
        {/* TODO add community description */}
      </div>

      <div className="flex border-stone-300 border-t text-sm text-stone-600">
        <div className="w-1/2 p-4 border-stone-300 border-r">
          <Suspense>
            <MembershipCount communityId={community.id} locale={locale} />
          </Suspense>
        </div>
        <div className="w-1/2 p-4">{/* TODO add number of lists here */}</div>
      </div>
    </Link>
  );
}
