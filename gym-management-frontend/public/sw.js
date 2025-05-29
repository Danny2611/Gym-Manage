//public/sw.js
const CACHE_NAME = 'fitlife-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/offline.html'
];

// Install event
self.addEventListener('install', event => {
  console.log('SW: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force activate ngay lập tức
        self.skipWaiting();
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      self.clients.claim();
    })
  );
});

// Fetch event - Improved caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cache for API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Skip cache for browser extensions
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }
  
  // Skip cache for non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('SW: Serving from cache:', request.url);
          return response;
        }
        
        // Fetch from network
        console.log('SW: Fetching from network:', request.url);
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response before caching
            const responseToCache = response.clone();
            
            // Only cache specific file types
            if (shouldCache(request.url)) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(error => {
            console.log('SW: Fetch failed, trying cache:', error);
            
            // If request fails and it's a navigation request, serve offline page
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            throw error;
          });
      })
  );
});
// self.addEventListener('fetch', (event) => {
//   console.log('Service Worker: Fetching');
//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         // Make copy of response
//         const responseClone = response.clone();
//         // Open cache
//         caches.open(CACHE_NAME).then((cache) => {
//           // Add response to cache
//           cache.put(event.request, responseClone);
//         });
//         return response;
//       })
//       .catch(() => caches.match(event.request).then((response) => response))
//   );
// });

// Helper function to determine what to cache
function shouldCache(url) {
  const urlObj = new URL(url);
  
  // Cache static assets
  if (urlObj.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    return true;
  }
  
  // Cache HTML pages (but not API routes)
  if (urlObj.pathname.match(/\.html$/) || (!urlObj.pathname.includes('.') && !urlObj.pathname.startsWith('/api/'))) {
    return true;
  }
  
  return false;
}

// Push event - Nhận push notification
self.addEventListener('push', event => {
  console.log('SW: Push event received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body || data.message,
        icon: data.icon || '/icons/app-icon-192.png',
        badge: data.badge || '/icons/badge-icon.png',
        data: data.data || {},
        actions: data.actions || [
          {
            action: 'view',
            title: 'Xem chi tiết'
          },
          {
            action: 'close',
            title: 'Đóng'
          }
        ],
        requireInteraction: true,
        tag: data.data?.type || data.type || 'default',
        timestamp: Date.now()
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('SW: Error processing push data:', error);
    }
  }
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification click received:', event);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  
  if (event.action === 'view' || !event.action) {
    // Mở URL tương ứng
    const urlToOpen = data.url || '/dashboard';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Tìm tab đang mở với URL tương ứng
          for (let client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Nếu không tìm thấy, tìm tab nào đang mở app
          for (let client of clientList) {
            if (client.url.includes(location.origin) && 'focus' in client) {
              client.postMessage({
                type: 'NAVIGATE',
                url: urlToOpen
              });
              return client.focus();
            }
          }
          
          // Nếu không có tab nào, mở tab mới
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Helper function để mở URL
function openUrl(url) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      // Kiểm tra xem có tab nào đã mở app chưa
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Nếu có, focus vào tab đó và navigate
          return client.focus().then(() => {
            return client.navigate(url);
          });
        }
      }
      
      // Nếu không có tab nào mở, mở tab mới
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    });
}


// Notification close event
self.addEventListener('notificationclose', event => {
  console.log('SW: Notification closed:', event);
  // Analytics tracking có thể thêm ở đây
});

// Message event - Handle messages from main thread
self.addEventListener('message', event => {
  console.log('SW: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


// Background sync (optional - cho offline actions)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Xử lý các tác vụ cần sync khi online lại
      syncPendingNotifications()
    );
  }
});

// Sync pending notifications
async function syncPendingNotifications() {
  try {
    // Lấy các notification pending từ IndexedDB hoặc localStorage
    // Gửi lên server khi có kết nối
    console.log('Syncing pending notifications...');
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}