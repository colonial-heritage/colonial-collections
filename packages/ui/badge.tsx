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
    'flex flex-row items-center rounded py-1 px-1',
    {
      'bg-gray-medium text-xs text-gray-900': variant === 'transparent',
      'text-sm bg-stone-100': variant === 'gray',
      'bg-blueGrey-100 text-blueGrey-900 text-sm': variant === 'blue',
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

function BadgeIcon({Icon = XMarkIcon, variant = 'outline'}: BadgeIconProps) {
  const variantClassName = classNames(
    "w-4 h-4 fill-(lookup . 'twColor')-600 mr-1",
    {
      'stroke-stone-400': variant === 'outline',
      'fill-stone-400': variant === 'solid',
    }
  );
  return <Icon className={variantClassName} />;
}

interface BadgeActionProps {
  Icon?: React.ElementType;
  onClick: () => void;
}

function BadgeAction({Icon = XMarkIcon, onClick}: BadgeActionProps) {
  return (
    <button type="button" className="ml-1" onClick={onClick}>
      <Icon className="w-5 h-5 fill-(lookup . 'twColor')-800" />
    </button>
  );
}

Badge.Action = BadgeAction;
Badge.Icon = BadgeIcon;
