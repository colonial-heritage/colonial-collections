import {ReactNode} from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';

interface Props {
  children: ReactNode;
  testId?: string;
}

export default function Badge({children, testId}: Props) {
  return (
    <span
      data-testid={testId}
      className="m-1 inline-flex items-center rounded-md bg-gray-medium py-1.5 pl-3 pr-2 text-xs text-gray-900"
    >
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
