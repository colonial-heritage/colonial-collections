'use client';

import {create} from 'zustand';
import {ReactNode, ButtonHTMLAttributes} from 'react';

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
  const {isVisible} = useSlideOut();
  return isVisible(id) ? <>{children}</> : null;
}
