'use client';

import {Disclosure} from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useUnlocalizedPathname} from 'next-intl/client';
import Link from 'next/link';

interface Props {
  locale: string;
  navigationLabels: {
    home: string;
    register: string;
    about: string;
    faq: string;
    contact: string;
  };
}

export default function Navigation({locale, navigationLabels}: Props) {
  const pathname = useUnlocalizedPathname();

  const navigation = [
    {name: navigationLabels.home, href: '/'},
    {name: navigationLabels.register, href: '/register'},
    {name: navigationLabels.about, href: '/about'},
    {name: navigationLabels.faq, href: '/faq'},
    {name: navigationLabels.contact, href: '/contact'},
  ];

  return (
    <Disclosure as="nav" className="border-b border-gray-200 bg-white">
      {({open}) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                  {navigation.map(item => {
                    const current = item.href === pathname;
                    return (
                      <Link
                        key={item.name}
                        href={`/${locale}${item.href}`}
                        className={classNames(
                          current
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                        aria-current={current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map(item => {
                const current = item.href === pathname;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={`/${locale}${item.href}`}
                    className={classNames(
                      current
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                    )}
                    aria-current={current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
