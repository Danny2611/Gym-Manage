// src/services/offlineService.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";
interface OfflineDB extends DBSchema {
  user_data: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
      expiresAt?: number;
    };
  };
  sync_queue: {
    key: number;
    value: {
      id?: number;
      type: string;
      data: any;
      timestamp: number;
      retryCount: number;
      priority: number;
    };
    indexes: {
      priority: number;
      timestamp: number;
    };
  };
  cached_pages: {
    key: string;
    value: {
      url: string;
      html: string;
      timestamp: number;
      expiresAt: number;
    };
  };
}

class OfflineService {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private readonly DB_NAME = "FitLifeOfflineDB";
  private readonly DB_VERSION = 2;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<OfflineDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // User data store
        if (!db.objectStoreNames.contains("user_data")) {
          db.createObjectStore("user_data", { keyPath: "id" });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains("sync_queue")) {
          const syncStore = db.createObjectStore("sync_queue", {
            keyPath: "id",
            autoIncrement: true,
          });
          syncStore.createIndex("priority", "priority");
          syncStore.createIndex("timestamp", "timestamp");
        }

        // Cached pages store
        if (!db.objectStoreNames.contains("cached_pages")) {
          db.createObjectStore("cached_pages", { keyPath: "url" });
        }
      },
    });
  }

  // User data caching
  async cacheUserData(key: string, data: any, ttl?: number): Promise<void> {
    await this.init();
    const expiresAt = ttl ? Date.now() + ttl : undefined;

    await this.db!.put("user_data", {
      id: key,
      data,
      timestamp: Date.now(),
      expiresAt,
    });
  }

  async getCachedUserData<T>(key: string): Promise<T | null> {
    await this.init();
    const cached = await this.db!.get("user_data", key);

    if (!cached) return null;

    // Check expiration
    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      await this.db!.delete("user_data", key);
      return null;
    }

    return cached.data as T;
  }

  // Queue sync actions
  async queueSyncAction(type: string, data: any, priority = 5): Promise<void> {
    await this.init();

    await this.db!.add("sync_queue", {
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      priority,
    });
  }

  async getSyncQueue(): Promise<any[]> {
    await this.init();
    return await this.db!.getAllFromIndex("sync_queue", "priority");
  }

  async removeSyncAction(id: number): Promise<void> {
    await this.init();
    await this.db!.delete("sync_queue", id);
  }

  async updateSyncActionRetry(id: number): Promise<void> {
    await this.init();
    const action = await this.db!.get("sync_queue", id);
    if (action) {
      action.retryCount += 1;
      await this.db!.put("sync_queue", action);
    }
  }

  // Page caching
  async cachePage(
    url: string,
    html: string,
    ttl = 24 * 60 * 60 * 1000,
  ): Promise<void> {
    await this.init();

    await this.db!.put("cached_pages", {
      url,
      html,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  async getCachedPage(url: string): Promise<string | null> {
    await this.init();
    const cached = await this.db!.get("cached_pages", url);

    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      await this.db!.delete("cached_pages", url);
      return null;
    }

    return cached.html;
  }

  // Cleanup expired data
  async cleanup(): Promise<void> {
    await this.init();
    const now = Date.now();

    // Cleanup expired user data
    const tx1 = this.db!.transaction("user_data", "readwrite");
    const userStore = tx1.objectStore("user_data");
    const userCursor = await userStore.openCursor();

    while (userCursor) {
      const { value } = userCursor;
      if (value.expiresAt && now > value.expiresAt) {
        await userCursor.delete();
      }
      userCursor.continue();
    }

    // Cleanup expired pages
    const tx2 = this.db!.transaction("cached_pages", "readwrite");
    const pageStore = tx2.objectStore("cached_pages");
    const pageCursor = await pageStore.openCursor();

    while (pageCursor) {
      const { value } = pageCursor;
      if (now > value.expiresAt) {
        await pageCursor.delete();
      }
      pageCursor.continue();
    }
  }

  async clearAll(): Promise<void> {
    await this.init();
    const tx = this.db!.transaction(
      ["user_data", "sync_queue", "cached_pages"],
      "readwrite",
    );

    await Promise.all([
      tx.objectStore("user_data").clear(),
      tx.objectStore("sync_queue").clear(),
      tx.objectStore("cached_pages").clear(),
    ]);
  }
}

export const offlineService = new OfflineService();
