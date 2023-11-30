import {WrenchScrewdriverIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';

export function WipMessage() {
  const t = useTranslations('WorkInProgress');

  return (
    <div className="bg-consortiumGreen-100 text-consortiumBlue-800 w-full inline-flex flex-row justify-center items-center text-sm px-4 py-2 gap-1 sm:gap-3">
      <span className="flex flex-row items-center gap-1 sm:gap-3">
        <WrenchScrewdriverIcon className="w-4 h-4 fill--[#484635]" />
        <span className="text-center">{t('message')}</span>
      </span>
      <Link href="/roadmap" className="text-center">
        {t('roadmapLink')}
      </Link>
    </div>
  );
}
