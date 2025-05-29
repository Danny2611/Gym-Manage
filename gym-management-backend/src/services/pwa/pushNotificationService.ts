//services/pwa/pushNotificationService
import webpush from 'web-push';
import  PushSubscription  from '~/models/PushSubscription';
import  Notification  from '~/models/Notification';
import { Types } from 'mongoose';
// Lưu subscription của user
const saveSubscription = async (memberId: string, subscription: any, deviceInfo?: any) => {
  try {
    const pushSub = await PushSubscription.findOneAndUpdate(
      { member_id: memberId, endpoint: subscription.endpoint },
      {
        member_id: memberId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        device_info: deviceInfo,
        is_active: true,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    return pushSub;
  } catch (error) {
    console.error('Error saving push subscription:', error);
    throw error;
  }
};

// Gửi notification đến 1 user
const sendToUser = async (
  memberId: string,
  notificationData: {
    title: string;
    message: string;
    type: string;
    data?: any;
    scheduledAt?: Date;
  }
) => {
  try {
    const notification = new Notification({
      member_id: memberId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      data: notificationData.data,
      scheduled_at: notificationData.scheduledAt
    });

    await notification.save();

    if (!notificationData.scheduledAt) {
      await sendPushNotification((notification._id as Types.ObjectId).toString());
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification to user:', error);
    throw error;
  }
};

// Gửi push notification thực tế
const sendPushNotification = async (notificationId: string) => {
  try {
    const notification = await Notification.findById(notificationId).populate('member_id');
    if (!notification) throw new Error('Notification not found');

    const subscriptions = await PushSubscription.find({
      member_id: notification.member_id,
      is_active: true
    });

    if (subscriptions.length === 0) {
      console.log('No active subscriptions found for user');
      notification.status = 'failed';
      await notification.save();
      return;
    }

    const payload = {
      title: notification.title,
      body: notification.message,
      icon: '/icons/app-icon-192.png',
      badge: '/icons/badge-icon.png',
      data: {
        notificationId: notification._id,
        type: notification.type,
        url: getNotificationUrl(notification.type, notification.data),
        ...notification.data
      },
      actions: [
        { action: 'view', title: 'Xem chi tiết' },
        { action: 'close', title: 'Đóng' }
      ]
    };

    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys
          },
          JSON.stringify(payload)
        )
      )
    );

    let successCount = 0;
    let failedCount = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
      } else {
        failedCount++;
        console.error(`Failed to send to subscription ${index}:`, result.reason);
        if (result.reason?.statusCode === 410) {
          subscriptions[index].is_active = false;
          subscriptions[index].save();
        }
      }
    });

    notification.status = successCount > 0 ? 'sent' : 'failed';
    notification.sent_at = new Date();
    await notification.save();

    console.log(`Notification sent: ${successCount} success, ${failedCount} failed`);
    return { successCount, failedCount };
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    throw error;
  }
};

// Lấy URL tùy theo loại notification
const getNotificationUrl = (type: string, data?: any): string => {
  switch (type) {
    case 'membership':
      return '/dashboard/membership';
    case 'appointment':
      return `/dashboard/appointments/${data?.appointmentId || ''}`;
    case 'promotion':
      return `/packages?promo=${data?.promoId || ''}`;
    case 'workout':
      return '/dashboard/workout-schedule';
    default:
      return '/dashboard';
  }
};

// Gửi hàng loạt
const sendBulkNotifications = async (
  memberIds: string[],
  notificationData: {
    title: string;
    message: string;
    type: string;
    data?: any;
  }
) => {
  try {
    const results = await Promise.allSettled(
      memberIds.map(memberId => sendToUser(memberId, notificationData))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - successful;

    return { successful, failed, total: results.length };
  } catch (error) {
    console.error('Error in bulk notification:', error);
    throw error;
  }
};

// Lên lịch gửi
const scheduleNotification = async (
  memberId: string,
  notificationData: {
    title: string;
    message: string;
    type: string;
    data?: any;
    scheduledAt: Date;
  }
) => {
  return await sendToUser(memberId, notificationData);
};

// Xóa subscription
const removeSubscription = async (memberId: string, endpoint: string) => {
  try {
    await PushSubscription.findOneAndUpdate(
      { member_id: memberId, endpoint },
      { is_active: false, updated_at: new Date() }
    );
  } catch (error) {
    console.error('Error removing subscription:', error);
    throw error;
  }
};

// Export tất cả function
export default {
  saveSubscription,
  sendToUser,
  sendPushNotification,
  sendBulkNotifications,
  scheduleNotification,
  removeSubscription
};
