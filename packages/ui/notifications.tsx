'use client';

import {create} from 'zustand';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {ReactNode, useEffect} from 'react';
import {usePathname} from 'next/navigation';
import classNames from 'classnames';

type Notification = {
  id: string;
  message: ReactNode;
  type: 'success' | 'warning' | 'error';
};

interface State {
  notifications: Notification[];
  addNotification(item: Notification): void;
  removeNotification(item: Notification): void;
  reset(): void;
}

export const useNotifications = create<State>(set => ({
  notifications: [],
  addNotification: notification =>
    set(state => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: notification =>
    set(state => ({
      notifications: state.notifications.filter(i => i.id !== notification.id),
    })),
  reset: () =>
    set(() => ({
      notifications: [],
    })),
}));

interface NotificationsProps {
  prefixFilters?: string[];
}

export function Notifications({prefixFilters = []}: NotificationsProps) {
  const {notifications, removeNotification, reset} = useNotifications();
  const pathname = usePathname();

  useEffect(() => {
    // Reset notifications when the route changes
    reset();
  }, [pathname, reset]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      {notifications
        .filter(
          notification =>
            prefixFilters.length === 0 ||
            prefixFilters.some(prefix => notification.id.startsWith(prefix))
        )
        .map(notification => {
          return (
            <div
              data-testid="notification"
              key={notification.id}
              className={classNames(
                'justify-between items-center border p-4 rounded-xl flex my-2',
                {
                  'bg-green-grey-50 border-green-grey-100 text-green-grey-800':
                    notification.type === 'success',
                  'bg-yellow-50 border-yellow-100 text-yellow-800':
                    notification.type === 'warning',
                  'bg-red-50 border-red-100 text-red-800':
                    notification.type === 'error',
                }
              )}
            >
              <div>{notification.message}</div>
              <button
                onClick={() => removeNotification(notification)}
                className={classNames('hover:bg-gray-200 p-1 rounded', {
                  'text-green-grey-800': notification.type === 'success',
                  'text-yellow-800': notification.type === 'warning',
                  'text-red-800': notification.type === 'error',
                })}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })}
    </div>
  );
}
