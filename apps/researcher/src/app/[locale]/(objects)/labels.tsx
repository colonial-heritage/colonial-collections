'use client';

import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';

// In the current version of `next-intl` (3.0.0-beta.19), the server components do not fully support rich text.
// `t.rich` only support strings as response, not React components.
// This is fixed in the next version of `next-intl` (3.1.*), so we can remove this fix when we upgrade.

export function Description() {
  const t = useTranslations('Home');

  return t.rich('description', {
    em: text => <em>{text}</em>,
  });
}

export function CommunitiesLink() {
  const t = useTranslations('Home');

  return t.rich('communitiesLink', {
    link: text => <Link href="/communities">{text}</Link>,
  });
}
