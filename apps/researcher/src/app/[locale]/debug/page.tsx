import {DebugButton, AuthenticationObjectFrontend} from './frontend';
import {Notifications} from '@colonial-collections/ui';
import {auth} from '@clerk/nextjs/server';

export default async function DebugPage() {
  const authenticationObject = auth();

  return (
    <div>
      <h1>Debug</h1>
      <Notifications />
      <DebugButton />
      <h2>Authentication object backend</h2>
      <div>
        <pre>{JSON.stringify(authenticationObject, null, 2)}</pre>
      </div>
      <AuthenticationObjectFrontend />
    </div>
  );
}
