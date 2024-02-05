import {SignIn} from '@clerk/nextjs';
import {getLocale} from 'next-intl/server';
import {env} from 'node:process';

export default async function Page() {
  const locale = await getLocale();

  return (
    <SignIn
      redirectUrl="/"
      path={`/${locale}${env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}`}
    />
  );
}
