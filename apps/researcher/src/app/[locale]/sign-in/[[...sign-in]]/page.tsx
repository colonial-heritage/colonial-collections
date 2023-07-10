import {SignIn} from '@clerk/nextjs';
import {headers} from 'next/headers';

export default function Page() {
  // Get the path with the locale preset.
  const activePath = headers().get('x-pathname') || '/sign-in';

  return <SignIn path={activePath} />;
}
