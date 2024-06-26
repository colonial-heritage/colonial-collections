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
import {Link, usePathname} from '@/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {Fragment} from 'react';
import {locales} from '@/navigation';

import {ConsortiumLogo} from '@colonial-collections/ui/branding';
import logoImage from '@colonial-collections/ui/branding/logo-colonial-collections-dataset-browser.png';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();
  const locale = useLocale();

  const tNavigation = useTranslations('Navigation');
  const tLanguageSelector = useTranslations('LanguageSelector');
  const navigation = [
    {name: tNavigation('home'), href: '/'},
    {name: tNavigation('about'), href: '/about'},
    {name: tNavigation('faq'), href: '/faq'},
    {name: tNavigation('contact'), href: '/contact'},
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex text-sm flex-col sm:flex-row items-start sm:justify-between sm:items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-5 sm:w-10">
              <ConsortiumLogo />
            </div>
            <div className="relative h-6 sm:h-9">
              <Image
                src={logoImage}
                alt="Colonial Collections Consortium"
                sizes="33vw"
                style={{
                  width: 'auto',
                  height: '100%',
                }}
              />
            </div>
          </div>
        </Link>
        <div>
          {/* Top navigation */}
          <div>
            <div className="mx-auto flex h-10 max-w-7xl items-center justify justify-end">
              {/* Language selector */}
              <Listbox value={locale}>
                {({open}) => (
                  <>
                    <div className="relative mt-1 w-44">
                      <Listbox.Button
                        className="relative w-full py-2 pl-3 pr-8 text-left"
                        aria-label={tLanguageSelector(
                          'accessibilityLanguageSelector',
                          {
                            language: tLanguageSelector(locale),
                          }
                        )}
                      >
                        <span className="flex justify-end items-center">
                          <LanguageIcon className="w-4 h-4" />
                          <span className="ml-3 block truncate text-right">
                            {tLanguageSelector(locale)}
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
                          {locales.map(localeKey => (
                            <Link
                              key={localeKey}
                              href={pathname ?? '/'}
                              locale={localeKey}
                            >
                              <Listbox.Option
                                className={({active}) =>
                                  classNames(
                                    active
                                      ? 'text-white bg-sky-700'
                                      : 'text-gray-900',
                                    'relative select-none py-2 pl-3 pr-9'
                                  )
                                }
                                value={localeKey}
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
                                        {tLanguageSelector(localeKey)}
                                      </span>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? 'text-white'
                                            : 'text-sky-700',
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
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <Disclosure as="nav" id="page-navigation">
          {({open}) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-12 justify-between">
                  <div className="flex">
                    <div className="hidden sm:-my-px sm:flex sm:space-x-8 items-center">
                      {navigation.map(item => {
                        const isCurrentPathname = item.href === pathname;
                        return (
                          <span key={item.name} className="px-1 pt-1">
                            <Link
                              href={item.href}
                              title={item.name}
                              className={classNames(
                                isCurrentPathname
                                  ? 'font-semibold text-white'
                                  : 'border-transparent hover:font-semibold text-white ',
                                'inline-flex flex-col items-center',
                                // Don't shift on hover
                                // https://css-tricks.com/bold-on-hover-without-the-layout-shift/
                                'after:content-[attr(title)] after:font-semibold after:overflow-hidden after:invisible after:h-0'
                              )}
                              aria-current={
                                isCurrentPathname ? 'page' : undefined
                              }
                            >
                              {item.name}
                            </Link>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden ">
                    {/* Small screen menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-consortium-blue-900 hover:bg-consortium-blue-100 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2">
                      <span className="sr-only">
                        {tLanguageSelector('accessibilityOpenMenu')}
                      </span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pt-2 pb-3 absolute bg-consortium-blue-800 w-full z-50 left-0">
                  {navigation.map(item => {
                    const isCurrentPathname = item.href === pathname;
                    return (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className={classNames(
                          isCurrentPathname
                            ? 'bg-consortium-blue-800 text-white'
                            : ' hover:bg-consortium-blue-400 hover:border-text-right-300',
                          'block pl-3 pr-4 py-2 font-medium'
                        )}
                        aria-current={isCurrentPathname ? 'page' : undefined}
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
      </div>
    </div>
  );
}
