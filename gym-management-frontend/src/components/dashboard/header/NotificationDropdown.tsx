import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { usePushNotifications } from "~/hooks/usePushNotifications";
import { Notification } from "~/services/pwa/pushNotificationService";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    isSupported,
    isSubscribed,
    isPermissionGranted,
    isLoading,
    error,
    notifications,
    unreadCount,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendTestNotification,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount
  } = usePushNotifications();

  // Load notifications khi component mount và khi dropdown mở
  useEffect(() => {
    if (isSubscribed) {
      loadNotifications();
      refreshUnreadCount();
    }
  }, [isSubscribed, loadNotifications, refreshUnreadCount]);

  // Load notifications khi dropdown mở
  useEffect(() => {
    if (isOpen && isSubscribed) {
      loadNotifications();
    }
  }, [isOpen, isSubscribed, loadNotifications]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleNotificationClick = async () => {
    toggleDropdown();
    
    // Mark notifications as read when opening
    if (unreadCount > 0 && isSubscribed) {
      const unreadNotifications = notifications
        .filter(n => n.status === 'sent')
        .map(n => n._id);
      
      if (unreadNotifications.length > 0) {
        await markAsRead(unreadNotifications);
      }
    }
  };

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    if (!isPermissionGranted) {
      const granted = await requestPermission();
      if (!granted) {
        alert('Permission denied. Please enable notifications in your browser settings.');
        return;
      }
    }

    const success = await subscribeToNotifications();
    if (success) {
      alert('Notifications enabled successfully!');
    } else {
      alert('Failed to enable notifications. Please try again.');
    }
  };

  const handleDisableNotifications = async () => {
    const success = await unsubscribeFromNotifications();
    if (success) {
      alert('Notifications disabled successfully!');
    } else {
      alert('Failed to disable notifications. Please try again.');
    }
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (success) {
      alert('Test notification sent!');
    } else {
      alert('Failed to send test notification.');
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'workout':
        return '🏋️‍♂️';
      case 'nutrition':
        return '🥗';
      case 'achievement':
        return '🏆';
      case 'reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative">
      <button
        className="dropdown-toggle relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleNotificationClick}
        disabled={isLoading}
      >
        {unreadCount > 0 && (
          <>
            <span className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
            <span className="absolute -right-1 -top-1 h-5 w-5 animate-ping rounded-full bg-red-400 opacity-75"></span>
          </>
        )}
        
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="shadow-theme-lg dark:bg-gray-dark absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 sm:w-[361px] lg:right-0"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </h5>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={isLoading}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={toggleDropdown}
              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        {isSupported && (
          <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Push Notifications
              </span>
              {isSubscribed && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600 dark:bg-green-900 dark:text-green-400">
                  Active
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {isSubscribed ? (
                <>
                  <button
                    onClick={handleTestNotification}
                    className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    Test
                  </button>
                  <button
                    onClick={handleDisableNotifications}
                    className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    disabled={isLoading}
                  >
                    Disable
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEnableNotifications}
                  className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                  disabled={isLoading}
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-3 flex items-center justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* Notifications List */}
        <ul className="custom-scrollbar flex h-auto flex-col overflow-y-auto">
          {notifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-2 text-4xl">🔔</div>
              <p className="text-gray-500 dark:text-gray-400">
                No notifications yet
              </p>
              {!isSubscribed && isSupported && (
                <button
                  onClick={handleEnableNotifications}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  Enable push notifications
                </button>
              )}
            </li>
          ) : (
            notifications.map((notification: Notification) => (
              <li key={notification._id}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className={`px-4.5 flex gap-3 rounded-lg border-b border-gray-100 p-3 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 ${
                    notification.status === 'sent' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <span className="z-1 max-w-10 relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg dark:bg-gray-700">
                    {getNotificationIcon(notification.data?.type)}
                  </span>

                  <span className="block flex-1">
                    <span className="text-theme-sm mb-1.5 block text-gray-800 dark:text-white/90">
                      <span className="font-medium">
                        {notification.title}
                      </span>
                    </span>

                    <span className="text-theme-sm mb-2 block text-gray-600 dark:text-gray-300">
                      { notification.message}
                    </span>

                    <span className="text-theme-xs flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span>{notification.data?.type || 'General'}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                      <span>{formatTimeAgo(notification.created_at)}</span>
                      {notification.status === 'sent' && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                          <span className="text-blue-600 dark:text-blue-400">New</span>
                        </>
                      )}
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        <Link
          to="/notifications"
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}