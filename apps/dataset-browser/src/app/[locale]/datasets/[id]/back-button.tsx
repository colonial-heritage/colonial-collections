'use client';

import {Link} from '@/navigation';
import {useListHref} from '@colonial-collections/list-store';
import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';

export default function BackButton() {
  const href = useListHref();
  const t = useTranslations('Details');

  return (
    <Link href={href} className="inline-flex items-center mb-5 text-gray-900">
      <ChevronLeftIcon className="h-5 w-5" />
      {t('back')}
    </Link>
  );
}
