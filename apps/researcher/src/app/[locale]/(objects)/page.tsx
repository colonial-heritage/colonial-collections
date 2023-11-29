import {UserButton, SignInButton, auth} from '@clerk/nextjs';
import {
  getCommunities,
  getMemberships,
  isAdmin,
  userId,
} from '@/lib/community/actions';

export default async function TestPage() {
  const {userId: userIdAuth} = auth();
  const userIdNoStore = userId();
  const communities = await getCommunities();
  const communityLast = communities[communities.length - 1];
  const membersLast = await getMemberships(communityLast.id);
  const isAdminLast = isAdmin(membersLast);

  const communityFirst = communities[0];
  const membersFirst = await getMemberships(communityFirst.id);
  const isAdminFirst = isAdmin(membersFirst);
  return (
    <div>
      <h1>Test Page</h1>
      <UserButton afterSignOutUrl="/" />
      <SignInButton mode="modal" />
      <p>user Id: {userIdAuth}</p>
      <p>user Id (noStore): {userIdNoStore}</p>
      <p>community: {communityLast.name}</p>
      <p>is Admin: {isAdminLast ? 'true' : 'false'}</p>
      <p>community: {communityFirst.name}</p>
      <p>is Admin: {isAdminFirst ? 'true' : 'false'}</p>
    </div>
  );
}
