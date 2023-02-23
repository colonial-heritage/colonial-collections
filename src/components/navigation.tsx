'use client';

import {Disclosure, Listbox, Transition} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  LanguageIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {usePathname} from 'next-intl/client';
import {Link} from 'next-intl';
import {Fragment} from 'react';

interface Props {
  locale: string;
  navigationLabels: {
    home: string;
    register: string;
    about: string;
    faq: string;
    contact: string;
  };
  languageLabels: {
    dutch: string;
    english: string;
  };
}

export default function Navigation({
  locale,
  navigationLabels,
  languageLabels,
}: Props) {
  const pathname = usePathname();

  const navigation = [
    {name: navigationLabels.home, href: '/'},
    {name: navigationLabels.register, href: '/register'},
    {name: navigationLabels.about, href: '/about'},
    {name: navigationLabels.faq, href: '/faq'},
    {name: navigationLabels.contact, href: '/contact'},
  ];

  const languages = [
    {name: languageLabels.dutch, value: 'nl'},
    {name: languageLabels.english, value: 'en'},
  ];

  return (
    <>
      <header className="relative">
        <nav aria-label="Top">
          {/* Top navigation */}
          <div>
            <div className="mx-auto flex h-10 max-w-7xl items-center justify px-4 sm:px-6 lg:px-8 justify-end	">
              {/* Language selector */}
              <Listbox value={locale}>
                {({open}) => (
                  <>
                    <div className="relative mt-1 w-44">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-8 text-left sm:text-sm">
                        <span className="flex justify-end items-center">
                          <LanguageIcon className="w-4 h-4" />
                          <span className="ml-3 block truncate text-right">
                            {
                              languages.find(
                                language => language.value === locale
                              )!.name
                            }
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {languages.map(language => (
                            <Link
                              key={language.value}
                              href={pathname ?? '/'}
                              locale={language.value}
                            >
                              <Listbox.Option
                                className={({active}) =>
                                  classNames(
                                    active
                                      ? 'text-white bg-indigo-600'
                                      : 'text-gray-900',
                                    'relative select-none py-2 pl-3 pr-9'
                                  )
                                }
                                value={language}
                              >
                                {({selected, active}) => (
                                  <>
                                    <div className="flex items-center">
                                      <span
                                        className={classNames(
                                          selected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'ml-3 block truncate'
                                        )}
                                      >
                                        {language.name}
                                      </span>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? 'text-white'
                                            : 'text-indigo-600',
                                          'absolute inset-y-0 right-0 flex items-center pr-4'
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            </Link>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          </div>
        </nav>
      </header>
      <Disclosure as="nav" className="border-b border-gray-200 bg-white">
        {({open}) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="inline-flex items-center px-1 pt-1">
                  {/* TODO: Dataset Browser logo */}
                </div>
                <div className="flex">
                  <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                    {navigation.map(item => {
                      const current = item.href === pathname;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
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
                      href={item.href}
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
    </>
  );
}
