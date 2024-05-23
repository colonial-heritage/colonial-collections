'use client';

import {create} from 'zustand';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {ReactNode, useEffect} from 'react';
import {usePathname} from 'next/navigation';

const typeColors = {
  success: 'green-grey',
  warning: 'yellow',
  error: 'red',
};

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

export function Notifications() {
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
      {notifications.map(notification => {
        const typeColor = typeColors[notification.type];
        return (
          <div
            data-testid="notification"
            key={notification.id}
            className={`justify-between items-center bg-${typeColor}-50 border-${typeColor}-100 text-${typeColor}-800 border p-4 rounded-xl flex my-2`}
          >
            <div>{notification.message}</div>
            <button
              onClick={() => removeNotification(notification)}
              className={`hover:bg-${typeColor}-200 p-1 rounded`}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
