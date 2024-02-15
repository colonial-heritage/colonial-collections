'use client';

import {useUser} from '@clerk/nextjs';
import {logFailedAuthHealthCheck} from './backend';
import {useEffect, useRef} from 'react';

export default function FrontendHealthCheck({
  backendUserId,
}: {
  backendUserId?: string;
}) {
  const {user, isLoaded} = useUser();

  // Place `isLoaded` and `user` in a ref, so new values are accessible after a timeout.
  // https://github.com/facebook/react/issues/14010
  const isLoadedRef = useRef(isLoaded);
  const userRef = useRef(user);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
    userRef.current = user;
  }, [isLoaded, user]);

  // There is a bug within the clerk logic: sometimes, the user never loads.
  // Refresh the page if `isLoading` stays `false` too long.
  useEffect(() => {
    if (!isLoaded) {
      const delayDebounceFn = setTimeout(() => {
        if (!isLoadedRef.current) {
          logFailedAuthHealthCheck({
            message: '`useUser().isLoaded` stays `false`, refresh page',
            frontendUserId: userRef.current?.id,
            isLoaded: isLoadedRef.current,
          });
          location.reload();
        }
      }, 10000);

      return () => clearTimeout(delayDebounceFn);
    }
    return () => null;
  }, [isLoaded]);

  // The user in the frontend code using `useUser` and the user from the backend code using
  // `currentUser` should always be the same. Log differences for debugging purposes.
  useEffect(() => {
    if (isLoaded && !user && !!backendUserId) {
      logFailedAuthHealthCheck({
        message: 'There is a backend user but no frontend user',
        frontendUserId: userRef.current?.id,
        isLoaded: isLoadedRef.current,
      });
    }
  }, [backendUserId, isLoaded, user]);

  useEffect(() => {
    if (isLoaded && !!user && !backendUserId) {
      logFailedAuthHealthCheck({
        message: 'There is a frontend user but no backend user',
        frontendUserId: userRef.current?.id,
        isLoaded: isLoadedRef.current,
      });
    }
  }, [backendUserId, isLoaded, user]);

  return null;
}
