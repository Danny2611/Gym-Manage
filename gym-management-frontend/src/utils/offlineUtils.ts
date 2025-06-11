//src/utils/offlineUtils.ts - Utilities cho offline mode
export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = navigator.onLine;
  private listeners: ((online: boolean) => void)[] = [];

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): OfflineManager {
    if (!this.instance) {
      this.instance = new OfflineManager();
    }
    return this.instance;
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  public isOnlineStatus(): boolean {
    return this.isOnline;
  }

  public addListener(callback: (online: boolean) => void) {
    this.listeners.push(callback);
  }

  public removeListener(callback: (online: boolean) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(callback => callback(online));
  }

  private async syncPendingData() {
    // Trigger service worker sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('dashboard-sync');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // Cache data locally
  public async cacheData(key: string, data: any) {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  // Get cached data
  public getCachedData(key: string, maxAge: number = 24 * 60 * 60 * 1000) {
    try {
      const cached = localStorage.getItem(`offline_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // Check if data is still valid
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`offline_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }
}