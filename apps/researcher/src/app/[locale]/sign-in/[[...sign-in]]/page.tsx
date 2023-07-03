import {SignIn} from '@clerk/nextjs';
import {useLocale} from 'next-intl';

export default function Page() {
  const locale = useLocale();
  const path = locale === 'en' ? '/sign-in' : `/${locale}/sign-in`;

  return <SignIn path={path} />;
}
