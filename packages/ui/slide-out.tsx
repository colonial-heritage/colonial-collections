'use client';

import {create} from 'zustand';
import {ReactNode, ButtonHTMLAttributes, useEffect} from 'react';
import {usePathname} from 'next/navigation';

interface SlideOutState {
  visibleIds: {
    [id: string]: Boolean;
  };
  setIsVisible: (id: string, isVisible: Boolean) => void;
  isVisible: (id: string) => Boolean;
}

export const useSlideOut = create<SlideOutState>((set, get) => ({
  visibleIds: {},
  setIsVisible: (id, isVisible) =>
    set(state => ({
      visibleIds: {
        ...state.visibleIds,
        [id]: isVisible,
      },
    })),
  isVisible: id => {
    const visible = get().visibleIds[id];
    return visible === undefined ? false : visible;
  },
}));

interface SlideOutButtonProps {
  id: string;
  children: ReactNode;
}

export function SlideOutButton({
  id,
  children,
  ...buttonProps
}: SlideOutButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const {setIsVisible, isVisible} = useSlideOut();
  return (
    <button {...buttonProps} onClick={() => setIsVisible(id, !isVisible(id))}>
      {children}
    </button>
  );
}

interface SlideOutProps {
  id: string;
  children: ReactNode;
}

export function SlideOut({id, children}: SlideOutProps) {
  const {isVisible, setIsVisible} = useSlideOut();
  const pathname = usePathname();

  useEffect(() => {
    // Close slide out when the route changes
    setIsVisible(id, false);
  }, [id, pathname, setIsVisible]);

  return isVisible(id) ? <>{children}</> : null;
}