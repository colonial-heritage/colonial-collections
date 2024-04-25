'use server';

import {auth, currentUser} from '@clerk/nextjs/server';

interface props {
  message: string;
  frontendUserId?: string;
  isLoaded: boolean;
}

export async function logFailedAuthHealthCheck({
  message,
  frontendUserId,
  isLoaded,
}: props) {
  const backendUser = await currentUser();
  const backendAuth = await auth();

  console.error('AUTH HEATH CHECK FAILED');
  console.error(message);
  console.error('Frontend user loaded', isLoaded);
  console.error('Frontend user ID', frontendUserId);
  console.error('Backend `auth`', backendAuth);
  console.error('Backend `currentUser`', backendUser);
}
