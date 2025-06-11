// src/hooks/usePushNotifications.ts
import { useState, useEffect, useCallback } from "react";
import {
  pushNotificationService,
  type PushSubscriptionData,
  type Notification,
} from "~/services/pwa/pushNotificationService";

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  isPermissionGranted: boolean;
  isLoading: boolean;
  error: string | null;
  subscription: PushSubscription | null;
  notifications: Notification[];
  unreadCount: number;
}

interface PushNotificationActions {
  requestPermission: () => Promise<boolean>;
  subscribeToNotifications: () => Promise<boolean>;
  unsubscribeFromNotifications: () => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

export const usePushNotifications = (): PushNotificationState &
  PushNotificationActions => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported:
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window,
    isSubscribed: false,
    isPermissionGranted: false,
    isLoading: false,
    error: null,
    subscription: null,
    notifications: [],
    unreadCount: 0,
  });

  // Kiểm tra permission ban đầu
  useEffect(() => {
    if (
      !(
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
      )
    )
      return;

    setState((prev) => ({
      ...prev,
      isSupported: true,
      isPermissionGranted: Notification.permission === "granted",
    }));

    checkCurrentSubscription();
  }, []);

  // Kiểm tra subscription hiện tại
  const checkCurrentSubscription = useCallback(async () => {
    if (
      !(
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
      )
    )
      return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setState((prev) => ({
        ...prev,
        isSubscribed: !!subscription,
        subscription,
      }));

      if (subscription) {
        await refreshUnreadCount();
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  }, []); // ✅ Không cần dependency

  // Yêu cầu permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Push notifications are not supported",
      }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const permission = await Notification.requestPermission();
      const isGranted = permission === "granted";

      setState((prev) => ({
        ...prev,
        isPermissionGranted: isGranted,
        isLoading: false,
        error: isGranted ? null : "Permission denied for notifications",
      }));

      return isGranted;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to request permission",
      }));
      return false;
    }
  }, [state.isSupported]);

  // Đăng ký push notifications
  // Đăng ký push notifications - Version được sửa lỗi
  const subscribeToNotifications = useCallback(async (): Promise<boolean> => {
    console.log("🔄 Starting subscription process...");

    if (!state.isSupported || !state.isPermissionGranted) {
      console.error("❌ Not supported or permission not granted:", {
        isSupported: state.isSupported,
        isPermissionGranted: state.isPermissionGranted,
      });
      setState((prev) => ({ ...prev, error: "Permission not granted" }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log("🔑 Getting VAPID public key...");

      // Lấy VAPID public key
      const vapidResponse = await pushNotificationService.getVapidPublicKey();
      console.log("📋 VAPID Response:", vapidResponse);

      if (!vapidResponse.success) {
        console.error("❌ Cannot get VAPID public key:", vapidResponse.message);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Không thể lấy VAPID public key: " + vapidResponse.message,
        }));
        return false;
      }

      const publicKey = vapidResponse.publicKey;
      console.log("✅ Public key received:", publicKey);

      // Kiểm tra Service Worker
      console.log("🔧 Checking Service Worker...");
      if (!navigator.serviceWorker.controller) {
        console.warn("⚠️ No active service worker found, waiting for ready...");
      }

      // Lấy Service Worker registration
      const registration = await navigator.serviceWorker.ready;
      console.log("✅ Service Worker ready:", registration);

      // Kiểm tra xem đã có subscription chưa
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("⚠️ Existing subscription found, unsubscribing first...");
        await existingSubscription.unsubscribe();
      }

      console.log("📱 Creating new push subscription...");

      // Đăng ký push với error handling chi tiết
      let subscription;
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        console.log("✅ Push subscription created:", subscription);
      } catch (subscribeError) {
        console.error("❌ Error creating push subscription:", subscribeError);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to create push subscription: " + subscribeError,
        }));
        return false;
      }

      // Lấy keys
      console.log("🔐 Extracting subscription keys...");
      const p256dhKey = subscription.getKey("p256dh");
      const authKey = subscription.getKey("auth");

      if (!p256dhKey || !authKey) {
        console.error("❌ Missing push subscription keys:", {
          p256dhKey: !!p256dhKey,
          authKey: !!authKey,
        });
        throw new Error("Missing push subscription keys");
      }

      console.log("✅ Keys extracted successfully");

      // Chuẩn bị dữ liệu gửi lên server
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(p256dhKey),
          auth: arrayBufferToBase64(authKey),
        },
      };

      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      };

      console.log("📤 Sending subscription to server...", {
        endpoint: subscriptionData.endpoint.substring(0, 50) + "...",
        hasKeys: !!(subscriptionData.keys.p256dh && subscriptionData.keys.auth),
      });

      // Gửi subscription lên server
      const response = await pushNotificationService.subscribe(
        subscriptionData,
        deviceInfo,
      );
      console.log("📥 Server response:", response);

      if (response.success) {
        console.log("✅ Subscription successful!");
        setState((prev) => ({
          ...prev,
          isSubscribed: true,
          subscription,
          isLoading: false,
          error: null,
        }));

        await refreshUnreadCount();
        return true;
      } else {
        console.error("❌ Server rejected subscription:", response.message);
        throw new Error(response.message || "Server rejected subscription");
      }
    } catch (error) {
      console.error("❌ Error in subscription process:", error);

      let errorMessage = "Failed to subscribe to notifications";
      if (error instanceof Error) {
        errorMessage += ": " + error.message;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [state.isSupported, state.isPermissionGranted]);

  // Hủy đăng ký push notifications
  const unsubscribeFromNotifications =
    useCallback(async (): Promise<boolean> => {
      if (!state.subscription) return false;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Hủy subscription trên browser
        await state.subscription.unsubscribe();

        // Hủy subscription trên server
        await pushNotificationService.unsubscribe(state.subscription.endpoint);

        setState((prev) => ({
          ...prev,
          isSubscribed: false,
          subscription: null,
          isLoading: false,
          notifications: [],
          unreadCount: 0,
        }));

        return true;
      } catch (error) {
        console.error("Error unsubscribing:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to unsubscribe from notifications",
        }));
        return false;
      }
    }, [state.subscription]);

  // Gửi test notification
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!state.isSubscribed) {
      setState((prev) => ({
        ...prev,
        error: "Not subscribed to notifications",
      }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await pushNotificationService.sendTestNotification();

      setState((prev) => ({ ...prev, isLoading: false }));

      if (response.success) {
        await refreshUnreadCount();
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message ?? "Unknown error",
        }));

        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to send test notification",
      }));
      return false;
    }
  }, [state.isSubscribed]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!state.isSubscribed) return;

    try {
      const response = await pushNotificationService.getUserNotifications({
        page: 1,
        limit: 50,
      });
      console.log("getUserNotifications:", response);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          notifications: response.data!.notifications,
        }));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [state.isSubscribed]);

  // Đánh dấu đã đọc
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const response =
        await pushNotificationService.markAsRead(notificationIds);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((notification) =>
            notificationIds.includes(notification._id)
              ? {
                  ...notification,
                  status: "read" as const,
                  read_at: new Date(),
                }
              : notification,
          ),
        }));

        await refreshUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }, []);

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await pushNotificationService.markAllAsRead();

      if (response.success) {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((notification) => ({
            ...notification,
            status: "read" as const,
            read_at: new Date(),
          })),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await pushNotificationService.getUnreadCount();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          unreadCount: response.data!.count,
        }));
      }
    } catch (error) {
      console.error("Error refreshing unread count:", error);
    }
  }, []);

  // Listen for messages from service worker
  useEffect(() => {
    if (!state.isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "NOTIFICATION_RECEIVED") {
        refreshUnreadCount();
        loadNotifications();
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [state.isSupported, loadNotifications, refreshUnreadCount]);

  return {
    ...state,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendTestNotification,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount,
  };
};

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
