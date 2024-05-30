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
import classNames from 'classnames';

interface SlideOverProps {
  children: ReactNode;
  variant?: 'text' | 'gallery';
}

interface SlideOverContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  variant: SlideOverProps['variant'];
}

const SlideOverContext = createContext<SlideOverContextType>({
  isOpen: false,
  setIsOpen: () => {},
  variant: 'text',
});

export function SlideOver({children, variant = 'text'}: SlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const context = {
    isOpen,
    setIsOpen,
    variant,
  };
  return (
    <SlideOverContext.Provider value={context}>
      {children}
    </SlideOverContext.Provider>
  );
}

interface SlideOverDialogProps {
  children: ReactNode;
}

export function SlideOverDialog({children}: SlideOverDialogProps) {
  const {isOpen, setIsOpen, variant} = useContext(SlideOverContext);

  const panelClassName = classNames('pointer-events-auto w-screen', {
    'max-w-md bg-white text-gray-900': variant === 'text',
    'max-w-full bg-neutral-600': variant === 'gallery',
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className={panelClassName}>
                  <div className="flex h-full flex-col shadow-xl">
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface OpenButtonProps {
  children: ReactNode;
  className?: string;
}

export function SlideOverOpenButton({children, className}: OpenButtonProps) {
  const {setIsOpen} = useContext(SlideOverContext);

  return (
    <button className={className} onClick={() => setIsOpen(isOpen => !isOpen)}>
      {children}
    </button>
  );
}

interface SlideOverHeaderProps {
  children?: ReactNode;
}

export function SlideOverHeader({children}: SlideOverHeaderProps = {}) {
  const {variant, setIsOpen} = useContext(SlideOverContext);

  const headerClassName = classNames({
    'p-4 sm:px-6': variant === 'text',
    'bg-neutral-700': variant === 'gallery',
  });
  const buttonClassName = classNames(
    'rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-consortium-sand-800 focus:ring-offset-2',
    {
      'bg-white text-gray-400': variant === 'text',
      'bg-black text-white p-2 my-2 mx-6': variant === 'gallery',
    }
  );

  return (
    <div className={headerClassName}>
      <div className="flex items-center justify-end">
        {children}
        <div className="ml-3 flex items-center">
          <button
            type="button"
            className={buttonClassName}
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close panel</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SlideOverContent({children}: SlideOverDialogProps) {
  const {variant} = useContext(SlideOverContext);
  const className = classNames('relative flex-1', {
    'mt-6 px-4 sm:px-6': variant === 'text',
  });

  return <div className={className}>{children}</div>;
}
