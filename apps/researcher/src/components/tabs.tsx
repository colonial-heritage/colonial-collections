import classNames from 'classnames';
import {ObjectIcon, PersonIcon} from '@/components/icons';
import {useTranslations} from 'next-intl';
import {Link} from '@/navigation';
import {headers} from 'next/headers';
import {locales} from '@/navigation';

export default function Tabs() {
  const t = useTranslations('Tabs');

  // This header is removed, if we reintegrate this component,
  // we need to find a way to pass the activePath
  const activePath = headers().get('x-pathname') || '/';

  const tabs = [
    {
      name: t('objects'),
      isCurrentRegex: `^(/(${locales.join('|')}))?/objects$`,
      href: '/objects',
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
                ? 'bg-consortiumBlue-600 text-white font-semibold'
                : 'border border-consortiumBlue-600 text-consortiumBlue-100 hover:border-white hover:text-white',
              'flex rounded-t p-2 items-center gap-1'
            )}
            aria-current={isCurrentPathname ? 'page' : undefined}
          >
            <tab.icon
              className={classNames(
                isCurrentPathname
                  ? 'stroke-white'
                  : 'stroke-consortiumBlue-100',
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
