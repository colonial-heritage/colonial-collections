'use client';

import {create} from 'zustand';
import {ReactNode, ButtonHTMLAttributes, useEffect, Fragment} from 'react';
import {usePathname} from 'next/navigation';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';
import classNames from 'classnames';

interface ModalState {
  visibleId: string | null;
  show: (id: string) => void;
  hide: () => void;
  toggle: (id: string) => void;
}

export const useModal = create<ModalState>(set => ({
  visibleId: null,
  show: id =>
    set(() => ({
      visibleId: id,
    })),
  hide: () =>
    set(() => ({
      visibleId: null,
    })),
  toggle: id =>
    set(state => ({
      visibleId: state.visibleId === id ? null : id,
    })),
}));

interface ModalButtonProps {
  id: string;
  children: ReactNode;
  testId?: string;
}

export function ModalButton({
  id,
  children,
  testId,
  ...buttonProps
}: ModalButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const {toggle} = useModal();
  return (
    <button data-testid={testId} {...buttonProps} onClick={() => toggle(id)}>
      {children}
    </button>
  );
}

interface ModalProps {
  id: string;
  children: ReactNode;
  variant?: 'full' | 'medium' | 'small';
}

export function Modal({children, id, variant = 'full'}: ModalProps) {
  const {visibleId, hide} = useModal();
  const pathname = usePathname();

  useEffect(() => {
    // Close modal when the route changes
    hide();
  }, [hide, pathname]);

  return (
    <Transition show={visibleId === id} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => hide()}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={classNames(
                  'relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full mx-6 text-neutral-800',
                  {
                    'md:h-[80vh] md:max-h-[80vh] h-full max-h-full':
                      variant === 'full',
                    'max-w-3xl': variant === 'medium',
                    'max-w-md': variant === 'small',
                  }
                )}
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface ModalHeaderProps {
  title?: string;
}

export function ModalHeader({title}: ModalHeaderProps = {}) {
  const {hide} = useModal();
  const t = useTranslations('Modal');

  return (
    <div className="flex justify-between grow">
      <legend className="block font-semibold text-gray-900">{title}</legend>
      <div>
        <button
          id="buttonCollapse"
          className="ml-3 items-center flex"
          onClick={() => hide()}
        >
          <span>{t('close')}</span>
          <XMarkIcon className="w-4 h-4 mt-1" />
        </button>
      </div>
    </div>
  );
}
