import {Link} from '@/navigation';
import {ExclamationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {SlideOut, SlideOutButton} from '@colonial-collections/ui';
import {getTranslations} from 'next-intl/server';
import {PropsWithChildren, ReactNode} from 'react';
import {auth} from '@clerk/nextjs';
import {getMyCommunities} from '@/lib/community/actions';

interface Props {
  slideOutId: string;
  title: string | ReactNode;
}

async function BaseSideOut({
  slideOutId,
  title,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-300 text-neutral-800 self-end flex-col gap-4 mb-4 flex">
      <div className="flex justify-between items-center border-b border-neutral-300 -mx-4 px-4 pb-2 mb-2">
        <h3 className="flex gap-2 items-center">
          <ExclamationCircleIcon className="w-6 h-6 text-neutral-900" />
          {title}
        </h3>
        <SlideOutButton
          id={slideOutId}
          className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
        >
          <XMarkIcon className="w-4 h-4 text-neutral-900" />
        </SlideOutButton>
      </div>
      {children}
    </div>
  );
}

export async function SignedOutSlideOut({slideOutId, title}: Props) {
  const t = await getTranslations('SignedOutSlideOut');

  return (
    <BaseSideOut slideOutId={slideOutId} title={title}>
      <p>
        {t.rich('description', {
          link: text => <Link href="/sign-up">{text}</Link>,
        })}
      </p>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex gap-2">
          <Link
            href="/sign-in"
            className="rounded-full bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 p-1 sm:py-2 sm:px-3 no-underline text-xs transition flex items-center gap-1"
          >
            {t('login')}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 p-1 sm:py-2 sm:px-3 no-underline text-xs transition flex items-center gap-1"
          >
            {t('createAccount')}
          </Link>
          <SlideOutButton
            id={slideOutId}
            className="rounded-full bg-none hover:bg-neutral-300 text-neutral-800 border border-neutral-300 p-1 sm:py-2 sm:px-3 text-xs transition flex items-center gap-1"
          >
            {t('cancel')}
          </SlideOutButton>
        </div>
        <div className="w-full lg:w-1/3"></div>
      </div>
    </BaseSideOut>
  );
}

export async function NoCommunitySlideOut({slideOutId, title}: Props) {
  const t = await getTranslations('NoCommunitySlideOut');

  return (
    <BaseSideOut slideOutId={slideOutId} title={title}>
      <p>
        {t.rich('description', {
          link: text => <Link href="/sign-up">{text}</Link>,
        })}
      </p>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex gap-2">
          <Link
            href="/communities"
            className="rounded-full bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 p-1 sm:py-2 sm:px-3 no-underline text-xs transition flex items-center gap-1"
          >
            {t('goToCommunities')}
          </Link>
          <SlideOutButton
            id={slideOutId}
            className="rounded-full bg-none hover:bg-neutral-300 text-neutral-800 border border-neutral-300 p-1 sm:py-2 sm:px-3 text-xs transition flex items-center gap-1"
          >
            {t('cancel')}
          </SlideOutButton>
        </div>
        <div className="w-full lg:w-1/3"></div>
      </div>
    </BaseSideOut>
  );
}

interface SignedInWithCommunitySideOutProps {
  slideOutId: string;
  needAccountTitle: string;
  needCommunityTitle: string;
  children: ReactNode;
}

export async function SignedInWithCommunitySideOut({
  slideOutId,
  needAccountTitle,
  needCommunityTitle,
  children,
}: SignedInWithCommunitySideOutProps) {
  const {userId} = auth();

  if (!userId) {
    return (
      <SlideOut id={slideOutId}>
        <SignedOutSlideOut slideOutId={slideOutId} title={needAccountTitle} />
      </SlideOut>
    );
  }

  const myCommunities = await getMyCommunities({
    includeMembersCount: false,
    limit: 1,
  });

  if (myCommunities.length === 0) {
    return (
      <SlideOut id={slideOutId}>
        <NoCommunitySlideOut
          slideOutId={slideOutId}
          title={needCommunityTitle}
        />
      </SlideOut>
    );
  }

  return <SlideOut id={slideOutId}>{children}</SlideOut>;
}
