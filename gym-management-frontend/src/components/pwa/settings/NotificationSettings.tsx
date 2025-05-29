// src/components/settings/NotificationSettings.tsx
import React, { useState } from 'react';
import { Bell, BellOff, TestTube, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { usePushNotifications } from '~/hooks/usePushNotifications';

export const NotificationSettings: React.FC = () => {
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isSupported,
    isSubscribed,
    isPermissionGranted,
    isLoading,
    unreadCount,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendTestNotification
  } = usePushNotifications();

  const handleToggleNotifications = async () => {
    setError(null);
    
    try {
      if (!isPermissionGranted) {
        const granted = await requestPermission();
        if (!granted) {
          setError('Cần cấp quyền để nhận thông báo');
          return;
        }
      }

      if (isSubscribed) {
        const success = await unsubscribeFromNotifications();
        if (!success) {
          setError('Không thể hủy đăng ký thông báo');
        }
      } else {
        const success = await subscribeToNotifications();
        if (!success) {
          setError('Không thể đăng ký thông báo');
        }
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi thay đổi cài đặt thông báo');
    }
  };

  const handleSendTestNotification = async () => {
    setError(null);
    setTestNotificationSent(false);
    
    try {
      const success = await sendTestNotification();
      if (success) {
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 3000);
      } else {
        setError('Không thể gửi thông báo thử');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi thông báo thử');
    }
  };

  const getPermissionStatus = () => {
    if (!isSupported) return 'Không hỗ trợ';
    if (!isPermissionGranted) return 'Chưa cấp quyền';
    if (isSubscribed) return 'Đã bật';
    return 'Đã tắt';
  };

  const getPermissionStatusColor = () => {
    if (!isSupported || !isPermissionGranted) return 'text-red-600';
    if (isSubscribed) return 'text-green-600';
    return 'text-yellow-600';
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Thông báo không được hỗ trợ
            </h3>
            <p className="text-gray-600">
              Trình duyệt của bạn không hỗ trợ push notifications. 
              Vui lòng cập nhật lên phiên bản mới nhất hoặc sử dụng trình duyệt khác.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Cài đặt thông báo
        </h3>
        <p className="text-gray-600 text-sm">
          Quản lý cách bạn nhận thông báo từ ứng dụng
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {getPermissionStatus()}
              </div>
              <div className={`text-sm font-medium ${getPermissionStatusColor()}`}>
                Trạng thái
              </div>
            </div>
            
            {isSubscribed && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {unreadCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Chưa đọc
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ✓
                  </div>
                  <div className="text-sm text-gray-600">
                    Đang hoạt động
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm font-medium">Lỗi</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {testNotificationSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 text-sm font-medium">Thành công</p>
                <p className="text-green-700 text-sm">
                  Thông báo thử đã được gửi! Kiểm tra thông báo của bạn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            {isSubscribed ? (
              <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-base font-medium text-gray-900">
                Push Notifications
              </h4>
              <p className="text-sm text-gray-600">
                Nhận thông báo về lịch tập, dinh dưỡng và cập nhật ứng dụng
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggleNotifications}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubscribed
                ? 'bg-blue-600'
                : 'bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isSubscribed ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Test Notification */}
        {isSubscribed && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <TestTube className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    Gửi thông báo thử
                  </h4>
                  <p className="text-sm text-gray-600">
                    Kiểm tra xem thông báo có hoạt động đúng không
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSendTestNotification}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4" />
                )}
                Gửi thử
              </button>
            </div>
          </div>
        )}

        {/* Permission Help */}
        {!isPermissionGranted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 text-sm font-medium">Cần cấp quyền</p>
                <p className="text-blue-700 text-sm">
                  Để nhận thông báo, bạn cần cấp quyền thông báo cho trang web này. 
                  Nhấp vào nút bật thông báo và chọn "Cho phép" khi được hỏi.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};