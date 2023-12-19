'use client';

import {useClerk} from '@clerk/nextjs';
import {useEffect} from 'react';

export default function SetActive({communityId}: {communityId: string}) {
  const {setActive} = useClerk();

  useEffect(() => {
    setActive({organization: communityId});
  }, [communityId, setActive]);

  return null;
}
