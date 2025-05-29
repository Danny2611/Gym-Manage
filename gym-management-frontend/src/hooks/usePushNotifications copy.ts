// //hooks/usePushNotifications
// import { useState, useEffect, useCallback } from 'react';
// import { pushNotificationService, NotificationData } from '~/services/pwa/pushNotificationService';

// interface UsePushNotificationsReturn {
//   isSupported: boolean;
//   isSubscribed: boolean;
//   permission: NotificationPermission;
//   notifications: NotificationData[];
//   unreadCount: number;
//   isLoading: boolean;
//   error: string | null;
  
//   // Actions
//   subscribe: () => Promise<boolean>;
//   unsubscribe: () => Promise<boolean>;
//   requestPermission: () => Promise<NotificationPermission>;
//   sendTestNotification: (title?: string, message?: string) => Promise<void>;
//   loadNotifications: (page?: number) => Promise<void>;
//   markAsRead: (notificationIds: string[]) => Promise<void>;
//   markAllAsRead: () => Promise<void>;
//   refreshSubscriptionStatus: () => Promise<void>;
// }

// export const usePushNotifications = (): UsePushNotificationsReturn => {
//   const [isSupported, setIsSupported] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [permission, setPermission] = useState<NotificationPermission>('default');
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Khởi tạo service khi component mount
//   useEffect(() => {
//     const initializeService = async () => {
//       setIsLoading(true);
//       try {
//         const initialized = await pushNotificationService.initialize();
//         console.log("initialized", initialized)
//         setIsSupported(initialized);
        
//         if (initialized) {
//           await refreshSubscriptionStatus();
//           await loadNotifications();
//         }
//       } catch (err) {
//         setError('Failed to initialize push notifications');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeService();
//   }, []);

//   // Kiểm tra trạng thái subscription
//   const refreshSubscriptionStatus = useCallback(async () => {
//     try {
//       const status = await pushNotificationService.getSubscriptionStatus();
//       setIsSubscribed(status.isSubscribed);
      
//       const currentPermission = await pushNotificationService.checkPermission();
//       setPermission(currentPermission);
//     } catch (err) {
//       console.error('Error checking subscription status:', err);
//     }
//   }, []);

//   // Đăng ký push notification
//   const subscribe = useCallback(async (): Promise<boolean> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const success = await pushNotificationService.subscribe();
//       if (success) {
//         setIsSubscribed(true);
//         await refreshSubscriptionStatus();
//       }
//       return success;
//     } catch (err) {
//       setError('Failed to subscribe to push notifications');
//       console.error(err);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [refreshSubscriptionStatus]);

//   // Hủy đăng ký push notification
//   const unsubscribe = useCallback(async (): Promise<boolean> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const success = await pushNotificationService.unsubscribe();
//       if (success) {
//         setIsSubscribed(false);
//         await refreshSubscriptionStatus();
//       }
//       return success;
//     } catch (err) {
//       setError('Failed to unsubscribe from push notifications');
//       console.error(err);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [refreshSubscriptionStatus]);

//   // Yêu cầu quyền notification
//   const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
//     try {
//       const newPermission = await pushNotificationService.requestPermission();
//       setPermission(newPermission);
//       return newPermission;
//     } catch (err) {
//       console.error('Error requesting permission:', err);
//       return 'denied';
//     }
//   }, []);

//   // Gửi test notification
//   const sendTestNotification = useCallback(async (title?: string, message?: string) => {
//     setError(null);
//     try {
//       await pushNotificationService.sendTestNotification(title, message);
//     } catch (err) {
//       setError('Failed to send test notification');
//       throw err;
//     }
//   }, []);

//   // Load notifications
//   const loadNotifications = useCallback(async (page = 1) => {
//     setIsLoading(true);
//     try {
//       const result = await pushNotificationService.getNotifications(page);
//       setNotifications(prev => 
//         page === 1 ? result.notifications : [...prev, ...result.notifications]
//       );
      
//       // Tính số notification chưa đọc
//       const unread = result.notifications.filter(n => !n.read_at).length;
//       setUnreadCount(unread);
//     } catch (err) {
//       setError('Failed to load notifications');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Đánh dấu đã đọc
//   const markAsRead = useCallback(async (notificationIds: string[]) => {
//     try {
//       await pushNotificationService.markNotificationsAsRead(notificationIds);
      
//       // Cập nhật local state
//       setNotifications(prev => 
//         prev.map(n => 
//           notificationIds.includes(n.id) 
//             ? { ...n, status: 'read', read_at: new Date().toISOString() }
//             : n
//         )
//       );
      
//       setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
//     } catch (err) {
//       setError('Failed to mark notifications as read');
//       console.error(err);
//     }
//   }, []);

//   // Đánh dấu tất cả đã đọc
//   const markAllAsRead = useCallback(async () => {
//     const unreadIds = notifications
//       .filter(n => !n.read_at)
//       .map(n => n.id);
    
//     if (unreadIds.length > 0) {
//       await markAsRead(unreadIds);
//     }
//   }, [notifications, markAsRead]);

//   return {
//     isSupported,
//     isSubscribed,
//     permission,
//     notifications,
//     unreadCount,
//     isLoading,
//     error,
    
//     subscribe,
//     unsubscribe,
//     requestPermission,
//     sendTestNotification,
//     loadNotifications,
//     markAsRead,
//     markAllAsRead,
//     refreshSubscriptionStatus
//   };
// };