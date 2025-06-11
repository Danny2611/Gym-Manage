import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

import { Queue } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Danh sách các route cần cache offline
const offlineRoutesToCache = [
  {
    method: "GET",
    url: "/api/user/my-package/infor-membership",
  },
  {
    method: "POST",
    url: "/api/user/my-package/detail",
  },
  {
    method: "GET",
    url: "/api/user/transaction/success",
  },
  {
    method: "GET",
    url: "/api/user/appointments/next-week",
  },
  {
    method: "GET",
    url: "/api/public/promotions",
  },
  {
    method: "GET",
    url: "/api/user/workout/weekly",
  },
  {
    method: "GET",
    url: "/api/user/workout/next-week",
  },
];

// Cache cho API dashboard với NetworkFirst strategy
registerRoute(
  ({ url }) => {
    return offlineRoutesToCache.some(route => 
      url.pathname.includes(route.url)
    );
  },
  new NetworkFirst({
    cacheName: 'dashboard-api-cache',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          // Tạo unique cache key cho POST requests
          if (request.method === 'POST') {
            const body = await request.clone().text();
            return `${request.url}-${request.method}-${btoa(body)}`;
          }
          return `${request.url}-${request.method}`;
        },
       cacheWillUpdate: async ({ response }) => {
       return response.status === 200 ? response : null;
}

      },
    ],
  })
);

// Background Sync cho các thao tác cần đồng bộ
const bgSyncQueue = new Queue('dashboard-sync-queue', {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('Background sync successful:', entry.request.url);
      } catch (error) {
        console.error('Background sync failed:', error);
        // Có thể thêm lại vào queue nếu cần retry
        await queue.unshiftRequest(entry);
        break;
      }
    }
  },
});

// Xử lý các request cần background sync
const syncActions = [
  '/api/user/my-package/pause',
  '/api/user/my-package/resume',
  '/api/payment/register',
];

registerRoute(
  ({ url }) => {
    return syncActions.some(action => url.pathname.includes(action));
  },
  async ({ event }) => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      // Nếu offline, thêm vào background sync queue
      await bgSyncQueue.pushRequest({ request: event.request });
      
      // Trả về response báo lỗi tạm thời
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Không có kết nối mạng. Thao tác sẽ được thực hiện khi có mạng trở lại.',
          offline: true
        }),
        {
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
);

// Cache cho static assets
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => request.url,
      },
    ],
  })
);