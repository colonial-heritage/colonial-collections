'use client';

import {Fragment, useRef} from 'react';
import {Transition, Popover} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import classNames from 'classnames';

const timeoutDuration = 120;

interface PopoverMenuProps {
  buttonText: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}

export default function PopoverMenu({
  buttonText,
  children,
  variant,
}: PopoverMenuProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  function handleEnter(isOpen: boolean) {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    if (!isOpen) {
      triggerRef.current?.click();
    }
  }

  function handleLeave(isOpen: boolean) {
    timeOutRef.current = setTimeout(() => {
      if (isOpen) {
        triggerRef.current?.click();
      }
    }, timeoutDuration);
  }

  return (
    <>
      <Popover className="relative">
        {({open}) => (
          <div
            onMouseEnter={() => handleEnter(open)}
            onMouseLeave={() => handleLeave(open)}
          >
            <Popover.Button
              data-testid="popover-menu-button"
              className={classNames(
                'rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm flex gap-1 items-center',
                {
                  'bg-consortium-green-300 text-consortium-blue-800':
                    variant === 'primary',
                  'bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition':
                    variant === 'default',
                }
              )}
              ref={triggerRef}
            >
              {buttonText}
              <ChevronDownIcon
                className={classNames('-mr-1 h-5 w-5 text-consortium-blue-800', {
                  'text-consortium-blue-800': variant === 'primary',
                  'text-neutral-800': variant === 'default',
                })}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={classNames(
                  'drop-shadow-lg absolute top-9 rounded-lg gap-2 z-40 left-1/2 -translate-x-1/2 transform',
                  {
                    'bg-consortium-green-300 text-consortium-blue-800 border-t border-consortium-blue-800':
                      variant === 'primary',
                    'bg-neutral-100 border border-neutral-200':
                      variant === 'default',
                  }
                )}
              >
                {children}
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    </>
  );
}
