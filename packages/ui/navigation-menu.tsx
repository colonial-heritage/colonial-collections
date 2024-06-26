'use client';

import {
  Transition,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/react';
import {ChevronDownIcon, CheckIcon} from '@heroicons/react/20/solid';
import classNames from 'classnames';
import {ElementType, Fragment} from 'react';

interface Props {
  buttonText: string;
  className?: string;
  menuItems: {
    name: string;
    href: string;
    locale?: string;
    ariaLabel?: string;
    active?: boolean;
  }[];
  Link: ElementType;
}

export function NavigationMenu({
  buttonText,
  menuItems,
  className,
  Link,
}: Props) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className={classNames(className, 'flex items-center gap-1')}>
        <span>{buttonText}</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <MenuItems className="flex-col bg-consortium-blue-600 absolute z-20 shadow-lg flex">
          {menuItems.map(item => (
            <MenuItem key={item.name}>
              <Link
                href={item.href}
                locale={item.locale}
                className={
                  'text-white no-underline py-2 px-3 whitespace-nowrap flex items-center'
                }
                aria-current={item.active ? 'page' : undefined}
              >
                {item.name}
                {item.active && (
                  <CheckIcon className="ml-3 h-5 w-5" aria-hidden="true" />
                )}
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
