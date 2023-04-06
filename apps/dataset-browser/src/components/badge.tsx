import {ReactNode} from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';

interface Props {
  children: ReactNode;
  testId?: string;
  variant?: 'transparent' | 'gray';
}

export default function Badge({
  children,
  variant = 'transparent',
  testId,
}: Props) {
  const variantClassName = classNames(
    'inline-flex items-center rounded-md mr-4 px-2 py-1',
    {
      'bg-gray-medium text-xs text-gray-900': variant === 'transparent',
      'text-sm bg-stone-100': variant === 'gray',
    }
  );
  return (
    <span data-testid={testId} className={variantClassName}>
      {children}
    </span>
  );
}

interface BadgeActionProps {
  Icon?: React.ElementType;
  onClick: () => void;
}

function BadgeAction({Icon = XMarkIcon, onClick}: BadgeActionProps) {
  return (
    <button
      type="button"
      className="ml-1 inline-flex flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
      onClick={onClick}
    >
      <Icon className="h-3 w-3" />
    </button>
  );
}

Badge.Action = BadgeAction;
