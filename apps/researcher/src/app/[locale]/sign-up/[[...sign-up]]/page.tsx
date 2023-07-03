import {SignUp} from '@clerk/nextjs';
import {useLocale} from 'next-intl';

export default function Page() {
  const locale = useLocale();
  const path = locale === 'en' ? '/sign-up' : `/${locale}/sign-up`;

  return <SignUp path={path} />;
}
