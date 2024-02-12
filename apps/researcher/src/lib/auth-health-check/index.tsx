import {currentUser} from '@clerk/nextjs';
import FrontendHealthCheck from './frontend';

export default async function AuthHealthCheck() {
  const user = await currentUser();

  return <FrontendHealthCheck backendUserId={user?.id} />;
}
