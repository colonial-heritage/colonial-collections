'use client';

import {backendLogAction} from './backend';
import {useAuth} from '@clerk/nextjs';
import {jwtDecode} from 'jwt-decode';
import {useNotifications} from '@colonial-collections/ui';

const dateTimeFormat = new Intl.DateTimeFormat('nl', {
  dateStyle: 'full',
  timeStyle: 'long',
});

export function DebugButton() {
  const {isSignedIn, getToken, sessionId} = useAuth();
  const {addNotification} = useNotifications();

  const onClick = async () => {
    const token = await getToken();
    const tokenDecoded = token ? jwtDecode(token) : null;
    const date = tokenDecoded?.exp
      ? dateTimeFormat.format(tokenDecoded?.exp * 1000)
      : null;
    // Send the frontend data to the backend, so we can log it in Vercel
    backendLogAction({
      date,
      isSignedIn,
      token,
      tokenDecoded,
      sessionId,
    });
    addNotification({
      id: 'debugButtonClicked',
      message: 'Your data has been logged, please let Barbara know.',
      type: 'success',
    });
  };
  return (
    <button
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1"
      onClick={onClick}
    >
      BUG report: I don&apos;t see edit buttons
    </button>
  );
}

export function AuthenticationObjectFrontend() {
  const authenticationObject = useAuth();
  return (
    <div>
      <h2>Authentication object frontend</h2>
      <div>
        <pre>{JSON.stringify(authenticationObject, null, 2)}</pre>
      </div>
    </div>
  );
}
