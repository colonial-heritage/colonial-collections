import {ReactNode} from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';

interface Props {
  children: ReactNode;
  testId?: string;
  variant?: 'transparent' | 'gray' | 'blue';
}

export function Badge({children, variant = 'blue', testId}: Props) {
  const variantClassName = classNames(
    'rounded p-1 flex flex-row items-center',
    {
      'bg-gray-medium text-xs text-gray-900': variant === 'transparent',
      'text-sm bg-neutral-200': variant === 'gray',
      'bg-consortium-blue-100 text-neutral-900 text-sm': variant === 'blue',
    }
  );
  return (
    <span data-testid={testId} className={variantClassName}>
      {children}
    </span>
  );
}

interface BadgeIconProps {
  Icon?: React.ElementType;
  variant?: 'outline' | 'solid';
}

export function BadgeIcon({Icon = XMarkIcon, variant}: BadgeIconProps) {
  const variantClassName = classNames('w-4 h-4 mr-1', {
    "stroke-(lookup . 'twColor')": variant === 'outline',
    "fill-(lookup . 'twColor')": variant === 'solid',
  });

  return (
    <span className="mr-1">
      <Icon className={variantClassName} />
    </span>
  );
}

interface BadgeActionProps {
  Icon?: React.ElementType;
  onClick: () => void;
}

export function BadgeAction({Icon = XMarkIcon, onClick}: BadgeActionProps) {
  return (
    <button type="button" className="ml-1" onClick={onClick}>
      <Icon className="w-5 h-5 fill-(lookup . 'twColor')-800" />
    </button>
  );
}
