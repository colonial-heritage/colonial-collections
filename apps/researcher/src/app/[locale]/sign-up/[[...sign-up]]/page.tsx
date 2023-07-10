import {SignUp} from '@clerk/nextjs';
import {headers} from 'next/headers';

export default function Page() {
  // Get the path with the locale preset.
  const activePath = headers().get('x-pathname') || '/sign-up';

  return <SignUp path={activePath} />;
}
