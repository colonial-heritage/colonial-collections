'use client';

import {SignedIn as ClerkSignedIn} from '@clerk/nextjs';
import {ReactNode} from 'react';

/*
Use this component to wrap content that should only be visible to signed in users.
Do not use the <SignedIn /> component from @clerk/nextjs directly,
as it will sometimes not work in server components.
By wrapping it in this client component it always works.
*/
export default function SignedIn({children}: {children: ReactNode}) {
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}
