// src/components/pwa/push-notification.tsx
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { usePWA } from '~/hooks/usePWA';
import { usePushNotifications } from '~/hooks/usePushNotifications';

import { NotificationList } from './test/NotificationList';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { PWAUpdatePrompt } from './PWAUpdatePrompt';

interface PWAPushNotificationProps {
  children: React.ReactNode;
}

export const PWAPushNotification: React.FC<PWAPushNotificationProps> = ({ children }) => {
  const [isNotificationListOpen, setIsNotificationListOpen] = useState(false);
  const { isOnline } = usePWA();
  const { 
    isSupported: isNotificationSupported, 
    isSubscribed,
    unreadCount 
  } = usePushNotifications();

  useEffect(() => {
    // Listen for messages from service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NAVIGATE') {
          // Handle navigation from notification click
          window.history.pushState(null, '', event.data.url);
        }
      });
    }
  }, []);

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 text-sm fixed top-0 left-0 right-0 z-50">
          Bạn đang offline. Một số tính năng có thể bị hạn chế.
        </div>
      )}

      {/* Main content with offline padding */}
      <div className={!isOnline ? 'pt-10' : ''}>
        {children}
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* PWA Update Prompt */}
      <PWAUpdatePrompt />

      {/* Notification List */}
      <NotificationList
        isOpen={isNotificationListOpen}
        onClose={() => setIsNotificationListOpen(false)}
      />

      {/* Floating Notification Button - chỉ hiện khi có thông báo */}
      {isNotificationSupported && isSubscribed && unreadCount > 0 && (
        <button
          onClick={() => setIsNotificationListOpen(true)}
          className="fixed bottom-24 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-40 md:bottom-6"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </button>
      )}
    </>
  );
};