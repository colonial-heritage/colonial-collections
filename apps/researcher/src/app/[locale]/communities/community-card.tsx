import {Community, getMemberships} from '@/lib/community';
import {getTranslator} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import {Suspense} from 'react';
import {revalidatePath} from 'next/cache';
import {ClerkAPIResponseError} from '@clerk/shared';
import {objectList} from '@colonial-collections/database';

interface MembershipCountProps {
  communityId: string;
  locale: string;
}

async function MembershipCount({communityId, locale}: MembershipCountProps) {
  const t = await getTranslator(locale, 'Communities');

  let memberships = [];
  try {
    memberships = await getMemberships(communityId);
  } catch (err) {
    const errorStatus = (err as ClerkAPIResponseError).status;
    if (errorStatus === 404 || errorStatus === 410) {
      // This could be a sign of a deleted community in the cache.
      // So, revalidate the communities page.
      revalidatePath('/[locale]/communities', 'page');
    }
  }

  return t.rich('membershipCount', {
    count: memberships.length,
  });
}

interface MembershipCountProps {
  communityId: string;
  locale: string;
}

async function ObjectListCount({communityId, locale}: MembershipCountProps) {
  const t = await getTranslator(locale, 'Communities');

  let objectLists = [];
  try {
    objectLists = await objectList.getListsByCommunityId(communityId);
  } catch (err) {
    return t('objectListCountError');
  }

  return t.rich('objectListCount', {
    count: objectLists.length,
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
            <strong
              className="font-semibold ml-1"
              data-testid="community-item-name"
            >
              {community.name}
            </strong>
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
        <div className="w-1/2 p-4">
          <ObjectListCount communityId={community.id} locale={locale} />
        </div>
      </div>
    </Link>
  );
}
