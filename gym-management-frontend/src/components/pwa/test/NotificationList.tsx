// src/components/notifications/NotificationList.tsx
import React, { useEffect, useState } from 'react';
import { X, Check, CheckCheck, Clock, Bell, Trash2 } from 'lucide-react';
import { usePushNotifications } from '../../../hooks/usePushNotifications';
interface NotificationListProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({ 
  isOpen, 
  onClose, 
  className = '' 
}) => {
  const {
    notifications,
    unreadCount,
    isSubscribed,
    loadNotifications,
    markAsRead,
    markAllAsRead
  } = usePushNotifications();

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && isSubscribed) {
      loadNotifications();
    }
  }, [isOpen, isSubscribed, loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead([notificationId]);
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.length > 0) {
      await markAsRead(selectedNotifications);
      setSelectedNotifications([]);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return '💪';
      case 'nutrition':
        return '🥗';
      case 'reminder':
        return '⏰';
      case 'achievement':
        return '🏆';
      default:
        return '📢';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} thông báo chưa đọc</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
              {selectedNotifications.length > 0 ? (
                <>
                  <button
                    onClick={handleMarkSelectedAsRead}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <Check className="w-4 h-4" />
                    Đánh dấu đã đọc ({selectedNotifications.length})
                  </button>
                  <button
                    onClick={() => setSelectedNotifications([])}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Bỏ chọn
                  </button>
                </>
              ) : (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="w-4 h-4" />
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="flex-1 overflow-y-auto">
            {!isSubscribed ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa bật thông báo
                </h3>
                <p className="text-gray-500 mb-4">
                  Bật thông báo để nhận tin tức và cập nhật mới nhất
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có thông báo
                </h3>
                <p className="text-gray-500">
                  Thông báo của bạn sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.status === 'sent' ? 'bg-blue-50' : ''
                    } ${
                      selectedNotifications.includes(notification._id) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => toggleSelectNotification(notification._id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          {notification.status === 'sent' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          
                          {notification.status === 'sent' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};