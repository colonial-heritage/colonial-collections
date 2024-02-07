'use client';

import {
  Fragment,
  ReactNode,
  useState,
  createContext,
  useContext,
  Dispatch,
} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

interface SubMenuContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

const SubMenuContext = createContext<SubMenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

interface SmallScreenSubMenuProps {
  children: ReactNode;
}

export function SmallScreenSubMenu({children}: SmallScreenSubMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const context = {
    isOpen,
    setIsOpen,
  };
  return (
    <SubMenuContext.Provider value={context}>
      {children}
    </SubMenuContext.Provider>
  );
}

interface SubMenuDialogProps {
  children: ReactNode;
  title: string;
}

export function SubMenuDialog({children, title}: SubMenuDialogProps) {
  const {isOpen, setIsOpen} = useContext(SubMenuContext);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white px-4 py-4 pb-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface OpenButtonProps {
  children: ReactNode;
  className: string;
}

export function SubMenuButton({children, className}: OpenButtonProps) {
  const {setIsOpen} = useContext(SubMenuContext);
  return (
    <button className={className} onClick={() => setIsOpen(isOpen => !isOpen)}>
      {children}
    </button>
  );
}
