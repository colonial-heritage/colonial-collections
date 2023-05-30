import classNames from 'classnames';
import {ObjectIcon, PersonIcon} from '@/components/icons';
import {useTranslations} from 'next-intl';
import {headers} from 'next/headers';

export default function Tabs() {
  const t = useTranslations('Tabs');

  // The header 'x-invoke-path' always contains the language prefix even if the next-intl middleware removed it
  const activePath = headers().get('x-invoke-path') || '';

  const tabs = [
    {name: t('objects'), current: /^\/[^/]+$/, href: '/', icon: ObjectIcon},
    {
      name: t('persons'),
      current: /\/persons$/,
      href: '/persons',
      icon: PersonIcon,
    },
  ];

  return (
    <div className="mb-5">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => {
            const isCurrentPathname = tab.current.test(activePath);
            return (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  isCurrentPathname
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                )}
                aria-current={isCurrentPathname ? 'page' : undefined}
              >
                <tab.icon
                  className={classNames(
                    isCurrentPathname
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    '-ml-0.5 mr-2 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
