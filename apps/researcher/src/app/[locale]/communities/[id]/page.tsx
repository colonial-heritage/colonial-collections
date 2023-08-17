import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import {clerkClient, auth} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {JoinCommunityButton, EditCommunityButton} from './buttons';

interface Props {
  params: {id: string};
}

export default async function CommunityPage({params}: Props) {
  const t = await getTranslations('Community');

  let organization;
  try {
    organization = await clerkClient.organizations.getOrganization({
      organizationId: params.id,
    });
  } catch (error) {
    return <div data-testid="no-entity">{t('noEntity')}</div>;
  }

  const memberships =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: params.id,
    });

  const {userId} = auth();

  const isAdmin = memberships.some(membership => {
    return (
      membership.publicUserData?.userId === userId &&
      membership.role === 'admin'
    );
  });

  return (
    <>
      <div className=" px-4 sm:px-10 -mt-3 -mb-3 sm:-mb-9 flex gap-2 flex-row sm:justify-between w-full max-w-[1800px] mx-auto">
        <div>
          <Link href="/communities" className="flex items-center gap-1">
            <ChevronLeftIcon className="w-4 h-4 fill-neutral-500" />
            {t('backButton')}
          </Link>
        </div>
        <div className="sm:flex justify-end gap-4 hidden">
          {isAdmin && <EditCommunityButton />}
        </div>
      </div>
      <div className="px-4 my-10 sm:px-10 w-full max-w-[1800px] mx-auto">
        <h1 className="text-2xl md:text-4xl font-normal">
          {t('title')}
          <span className="font-semibold"> {organization.name}</span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full max-w-[1800px] mx-auto px-4 sm:px-10">
        <main className="w-full md:w-3/4">
          <div className="w-full flex flex-col md:flex-row justify-between">
            <div className="mb-4 max-w-3xl">
              {/*Place the description here*/}
            </div>
            <div className="flex flex-col items-start md:justify-center md:items-center w-full mb-4">
              <JoinCommunityButton organization={organization} />
            </div>
          </div>
          <h2 className="mb-6">{t('objectListsTitle')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
            {/*Place the lists here */}
          </div>
        </main>
        <aside className="w-full md:w-1/4 self-stretch">
          <h2 className="mb-4">{t('membersTitle')}</h2>
          <ul>
            {memberships.map(membership => (
              <li
                className="font-normal flex items-center gap-2 mb-3"
                key={membership.id}
              >
                <div className="w-10">
                  {membership.publicUserData?.profileImageUrl && (
                    <Image
                      src={membership.publicUserData.profileImageUrl}
                      alt=""
                      className="w-full rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="">
                    {membership.publicUserData?.firstName}{' '}
                    {membership.publicUserData?.lastName}
                  </div>
                  <div className="text-neutral-600">
                    {/* Place country name here */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
