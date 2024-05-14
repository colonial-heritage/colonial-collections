'use client';

import {useUser as useClerkUser} from '@clerk/nextjs';
import {useMemo} from 'react';
import {organizationToCommunity} from '../community/clerk-converters';

export function useUser() {
  const useClerkUserResponse = useClerkUser();
  const user = useMemo(() => {
    const clerkUser = useClerkUserResponse.user;
    if (!clerkUser) {
      return null;
    }

    return {
      id: clerkUser.id,
      fullName: clerkUser.fullName,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      iri: clerkUser.unsafeMetadata?.iri as string,
      communityMemberships: clerkUser.organizationMemberships.map(
        membership => ({
          id: membership.id,
          permissions: membership.permissions,
          community: organizationToCommunity(membership.organization),
          role: membership.role,
        })
      ),
    };
  }, [useClerkUserResponse.user]);

  return {
    ...useClerkUserResponse,
    user,
  };
}
