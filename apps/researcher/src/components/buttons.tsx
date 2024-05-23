import classNames from 'classnames';
import {ButtonHTMLAttributes, ReactNode} from 'react';

const baseButtonClasses =
  'p-1 sm:py-2 sm:px-3 rounded-full text-xs transition flex items-center gap-1 border disabled:opacity-50 disabled:cursor-default cursor-pointer whitespace-break-spaces';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function DefaultButton({children, ...buttonProps}: ButtonProps) {
  return (
    <button
      className={classNames(
        baseButtonClasses,
        'bg-none hover:enabled:bg-neutral-300 text-neutral-800 border-neutral-300'
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({children, ...buttonProps}: ButtonProps) {
  return (
    <button
      className={classNames(
        baseButtonClasses,
        'bg-consortium-green-300 text-consortium-blue-800 hover:enabled:bg-consortium-green-200'
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export function SettingsButton({children, ...buttonProps}: ButtonProps) {
  return (
    <button
      className={classNames(
        baseButtonClasses,
        'bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800'
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
