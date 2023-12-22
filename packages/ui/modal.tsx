'use client';

import {create} from 'zustand';
import {ReactNode, ButtonHTMLAttributes, useEffect, Fragment} from 'react';
import {usePathname} from 'next/navigation';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';

interface ModalState {
  visibleId: string | null;
  show: (id: string) => void;
  hide: () => void;
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
}));

interface ModalButtonProps {
  id: string;
  children: ReactNode;
}

export function ModalButton({
  id,
  children,
  ...buttonProps
}: ModalButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const {show} = useModal();
  return (
    <button {...buttonProps} onClick={() => show(id)}>
      {children}
    </button>
  );
}

interface ModalProps {
  id: string;
  children: ReactNode;
}

export function Modal({children, id}: ModalProps) {
  const {visibleId, hide} = useModal();
  const pathname = usePathname();

  useEffect(() => {
    // Close modal when the route changes
    hide();
  }, [hide, pathname]);

  return (
    <Transition.Root show={visibleId === id} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => hide()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative md:h-[80vh] md:max-h-[80vh] h-full max-h-full transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full mx-6 text-neutral-800">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
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
