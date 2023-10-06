'use client';

import {create} from 'zustand';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {ReactNode, useEffect} from 'react';
import {usePathname} from 'next/navigation';

type Notification = {
  id: string;
  message: ReactNode;
  type: 'success'; // For now we only have success notifications, but we could add more types later
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
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="justify-between items-center bg-greenGrey-50 border-greenGrey-100 text-greenGrey-800 border p-4 rounded-xl flex my-2"
        >
          <div>{notification.message}</div>
          <button
            onClick={() => removeNotification(notification)}
            className="hover:bg-greenGrey-200 p-1 rounded"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
