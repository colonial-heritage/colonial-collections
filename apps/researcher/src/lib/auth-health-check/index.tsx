import {currentUser} from '@clerk/nextjs/server';
import FrontendHealthCheck from './frontend';

export default async function AuthHealthCheck() {
  const user = await currentUser();

  return <FrontendHealthCheck backendUserId={user?.id} />;
}
