import {WrenchScrewdriverIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';

export default function WipMessage() {
  const t = useTranslations('WorkInProgress');

  return (
    <div className="bg-[#faf6e0] flex flex-col sm:flex-row justify-center items-center text-sm px-4 py-1 gap-1 sm:gap-3">
      <span className="flex flex-row items-center gap-1 sm:gap-3">
        <WrenchScrewdriverIcon className="w-4 h-4 fill--[#484635]" />
        <span className="text-center text-[#484635]">{t('message')}</span>
      </span>
      <Link href="/roadmap" className="text-center text-sky-900">
        {t('roadmapLink')}
      </Link>
    </div>
  );
}
