import classNames from 'classnames';
import {ObjectIcon, PersonIcon} from '@/components/icons';
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';
import {headers} from 'next/headers';
import {locales} from '@/middleware';

export default function Tabs() {
  const t = useTranslations('Tabs');

  const activePath = headers().get('x-pathname') || '/';

  const tabs = [
    {
      name: t('objects'),
      isCurrentRegex: `^/(${locales.join('|')})?$`,
      href: '/',
      icon: ObjectIcon,
    },
    {
      name: t('persons'),
      isCurrentRegex: `^(/(${locales.join('|')}))?/persons$`,
      href: '/persons',
      icon: PersonIcon,
    },
  ];

  return (
    <nav className="flex px-10 mt-10 mb-4" aria-label="Tabs">
      {tabs.map(tab => {
        const isCurrentPathname = new RegExp(tab.isCurrentRegex).test(
          activePath
        );
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={classNames(
              isCurrentPathname
                ? 'bg-neutral-100 text-neutral-800 font-semibold'
                : 'border border-neutral-200 text-neutral-500 hover:border-neutral-500 hover:text-neutral-800',
              'flex rounded-t p-2 items-center gap-1'
            )}
            aria-current={isCurrentPathname ? 'page' : undefined}
          >
            <tab.icon
              className={classNames(
                isCurrentPathname ? 'stroke-neutral-800' : 'stroke-neutral-500',
                'w-6 h-6'
              )}
              aria-hidden="true"
            />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
