'use client';

import {
  Fragment,
  useState,
  ReactNode,
  createContext,
  useContext,
  Dispatch,
} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}
const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

interface ModalProps {
  children: ReactNode;
}

function Modal({children}: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const context = {
    isOpen,
    setIsOpen,
  };
  return (
    <ModalContext.Provider value={context}>{children}</ModalContext.Provider>
  );
}

interface ModalDialogProps {
  children: ReactNode;
}

function ModalDialog({children}: ModalDialogProps) {
  const {isOpen, setIsOpen} = useContext(ModalContext);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface OpenButtonProps {
  children: ReactNode;
  className: string;
}

function ModalOpenButton({children, className}: OpenButtonProps) {
  const {setIsOpen} = useContext(ModalContext);
  return (
    <button className={className} onClick={() => setIsOpen(isOpen => !isOpen)}>
      {children}
    </button>
  );
}

export {Modal, ModalOpenButton, ModalDialog};
