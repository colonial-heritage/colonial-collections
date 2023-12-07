import {Community} from '@/lib/community/definitions';
import {getTranslations} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import {Link} from '@/navigation';
import Image from 'next/image';
import {Suspense} from 'react';
import {objectList} from '@colonial-collections/database';

interface MembershipCountProps {
  communityId: string;
}

async function ObjectListCount({communityId}: MembershipCountProps) {
  const t = await getTranslations('Communities');

  try {
    const objectListCount = await objectList.countByCommunityId(communityId);
    return t.rich('objectListCount', {
      count: objectListCount,
    });
  } catch (err) {
    console.error(err);
    return t('objectListCountError');
  }
}

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({community}: CommunityCardProps) {
  const t = useTranslations('Communities');

  return (
    <Link
      href={`/communities/${community.slug}`}
      className="rounded-lg mb-20 bg-[#f3eee2] hover:bg-[#f1e9d7] text-stone-800 transition flex flex-col"
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
      <div className="text-center m-4 line-clamp-3 grow">
        {community.description}
      </div>

      <div className="flex border-stone-300 border-t text-sm text-stone-600">
        <div className="w-1/2 p-4 border-stone-300 border-r">
          {t.rich('membershipCount', {
            count: community.membershipCount,
          })}
        </div>
        <div className="w-1/2 p-4">
          <Suspense>
            <ObjectListCount communityId={community.id} />
          </Suspense>
        </div>
      </div>
    </Link>
  );
}
