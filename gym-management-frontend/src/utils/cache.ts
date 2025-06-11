// src/utils/cache.ts

export class CacheManager {
  private static readonly CACHE_KEYS = {
    USER_PROFILE: "user_profile",
    USER_MEMBERSHIP: "user_membership",
    USER_SCHEDULE: "user_schedule",
    GYM_INFO: "gym_info",
  };

  // Lưu tất cả dữ liệu liên quan đến người dùng vào cache
  static async cacheUserData(
    userData: any,
    membership: any,
    schedule: any,
  ): Promise<void> {
    try {
      const promises = [
        this.setCacheData(this.CACHE_KEYS.USER_PROFILE, userData),
        this.setCacheData(this.CACHE_KEYS.USER_MEMBERSHIP, membership),
        this.setCacheData(this.CACHE_KEYS.USER_SCHEDULE, schedule),
      ];
      await Promise.all(promises);
      console.log("✅ User data cached successfully");
    } catch (error) {
      console.error("❌ Error caching user data:", error);
    }
  }

  // Lấy dữ liệu người dùng từ cache
  static async getCachedUserData(): Promise<{
    profile: any;
    membership: any;
    schedule: any;
  } | null> {
    try {
      const [profile, membership, schedule] = await Promise.all([
        this.getCacheData(this.CACHE_KEYS.USER_PROFILE),
        this.getCacheData(this.CACHE_KEYS.USER_MEMBERSHIP),
        this.getCacheData(this.CACHE_KEYS.USER_SCHEDULE),
      ]);

      if (!profile) return null;
      return { profile, membership, schedule };
    } catch (error) {
      console.error("❌ Error getting cached user data:", error);
      return null;
    }
  }

  // Lưu thông tin phòng gym
  static async cacheGymInfo(gymInfo: any): Promise<void> {
    try {
      await this.setCacheData(this.CACHE_KEYS.GYM_INFO, gymInfo);
      console.log("✅ Gym info cached successfully");
    } catch (error) {
      console.error("❌ Error caching gym info:", error);
    }
  }

  // Lấy thông tin phòng gym từ cache
  static async getCachedGymInfo(): Promise<any | null> {
    try {
      return await this.getCacheData(this.CACHE_KEYS.GYM_INFO);
    } catch (error) {
      console.error("❌ Error getting cached gym info:", error);
      return null;
    }
  }

  // Xóa toàn bộ dữ liệu cache (offline_data và sync_queue)
  static async clearAllCache(): Promise<void> {
    try {
      const db = await this.openDB();
      const tx1 = db.transaction("offline_data", "readwrite");
      const tx2 = db.transaction("sync_queue", "readwrite");
      tx1.objectStore("offline_data").clear();
      tx2.objectStore("sync_queue").clear();
      console.log("✅ All cache cleared");
    } catch (error) {
      console.error("❌ Error clearing all cache:", error);
    }
  }

  // Lưu dữ liệu vào object store
  private static async setCacheData(key: string, data: any): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(["offline_data"], "readwrite");
    const store = transaction.objectStore("offline_data");

    return new Promise((resolve, reject) => {
      const request = store.put({
        key,
        data,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Lấy dữ liệu từ object store theo key
  private static async getCacheData(key: string): Promise<any | null> {
    const db = await this.openDB();
    const transaction = db.transaction(["offline_data"], "readonly");
    const store = transaction.objectStore("offline_data");

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Khởi tạo / mở kết nối IndexedDB
  private static openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("FitLifeOfflineDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("offline_data")) {
          db.createObjectStore("offline_data", { keyPath: "key" });
        }

        if (!db.objectStoreNames.contains("sync_queue")) {
          db.createObjectStore("sync_queue", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }
}
