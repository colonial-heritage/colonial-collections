'use server';

import {auth, currentUser} from '@clerk/nextjs';
import {UserResource} from '@clerk/types';

interface props {
  message: string;
  frontendUser?: UserResource | null;
  isLoaded: boolean;
}

export async function logFailedAuthHealthCheck({
  message,
  frontendUser,
  isLoaded,
}: props) {
  const backendUser = await currentUser();
  const backendAuth = await auth();

  console.error('AUTH HEATH CHECK FAILED');
  console.error(message);
  console.error('Frontend user loaded', isLoaded);
  console.error('Frontend user', frontendUser);
  console.error('Backend `auth`', backendAuth);
  console.error('Backend `currentUser`', backendUser);
}
