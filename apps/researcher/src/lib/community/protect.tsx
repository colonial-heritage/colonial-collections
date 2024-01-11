'use client';

import {useClerk, Protect as ClerkProtect, useAuth} from '@clerk/nextjs';
import {ReactNode, useEffect} from 'react';

export default function Protect({
  children,
  communityId,
  permission,
}: {
  communityId: string;
  children: ReactNode;
  permission: string;
}) {
  const {setActive, organization, getOrganizationMemberships} = useClerk();
  const {isSignedIn} = useAuth();

  // Set active organization to communityId if user is signed in and a member of the community
  useEffect(() => {
    async function activate() {
      const userMemberships = await getOrganizationMemberships();
      const membership = userMemberships?.find(
        m => m.organization.id === communityId
      );
      if (membership) {
        await setActive({organization: communityId});
      }
    }
    isSignedIn && organization?.id !== communityId && activate();
  }, [
    communityId,
    getOrganizationMemberships,
    isSignedIn,
    organization?.id,
    setActive,
  ]);

  if (organization?.id === communityId) {
    return <ClerkProtect permission={permission}>{children}</ClerkProtect>;
  }

  return null;
}
