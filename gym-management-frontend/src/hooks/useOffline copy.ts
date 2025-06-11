// # Hook kiểm tra trạng thái kết nối
// src/hooks/useOffline.ts
import { useState, useEffect } from "react";
import { useOffline as useOfflineContext } from "../contexts/OfflineContext";
import { offlineService } from "~/services/pwa/offlineService";

export const useOffline = () => {
  return useOfflineContext();
};

export const useOfflineSync = () => {
  const { isOnline, syncOfflineData, syncPending } = useOfflineContext();
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  useEffect(() => {
    if (isOnline && autoSyncEnabled && !syncPending) {
      const timer = setTimeout(() => {
        syncOfflineData();
      }, 2000); // Delay 2 seconds before auto-sync

      return () => clearTimeout(timer);
    }
  }, [isOnline, autoSyncEnabled, syncPending, syncOfflineData]);

  return {
    autoSyncEnabled,
    setAutoSyncEnabled,
    manualSync: syncOfflineData,
    syncPending,
  };
};

export const useOfflineStorage = () => {
  const { getOfflineData, setOfflineData } = useOfflineContext();

  const cacheUserData = async (userData: any) => {
    await setOfflineData("user_profile", userData);
  };

  const getCachedUserData = async () => {
    return await getOfflineData("user_profile");
  };

  const cacheMembershipData = async (membershipData: any) => {
    await setOfflineData("user_membership", membershipData);
  };

  const getCachedMembershipData = async () => {
    return await getOfflineData("user_membership");
  };

  const cacheScheduleData = async (scheduleData: any) => {
    await setOfflineData("user_schedule", scheduleData);
  };

  const getCachedScheduleData = async () => {
    return await getOfflineData("user_schedule");
  };

  const cacheGymInfo = async (gymInfo: any) => {
    await setOfflineData("gym_info", gymInfo);
  };

  const getCachedGymInfo = async () => {
    return await getOfflineData("gym_info");
  };

  return {
    cacheUserData,
    getCachedUserData,
    cacheMembershipData,
    getCachedMembershipData,
    cacheScheduleData,
    getCachedScheduleData,
    cacheGymInfo,
    getCachedGymInfo,
  };
};

export const useOfflineData = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  options?: {
    ttl?: number;
    fallback?: T;
    refreshOnOnline?: boolean;
  },
) => {
  const [data, setData] = useState<T | null>(options?.fallback || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOffline();

  const loadData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      if (!forceRefresh) {
        const cachedData = await offlineService.getCachedUserData<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
        }
      }

      // Fetch fresh data if online
      if (isOnline) {
        const freshData = await fetchFn();
        setData(freshData);

        // Cache the fresh data
        await offlineService.cacheUserData(key, freshData, options?.ttl);
      } else if (!data) {
        // If offline and no cached data, try to get any available cached data
        const cachedData = await offlineService.getCachedUserData<T>(key);
        setData(cachedData || options?.fallback || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");

      // Try to use cached data on error
      const cachedData = await offlineService.getCachedUserData<T>(key);
      if (cachedData) {
        setData(cachedData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [key]);

  useEffect(() => {
    if (isOnline && options?.refreshOnOnline) {
      loadData(true);
    }
  }, [isOnline]);

  return {
    data,
    loading,
    error,
    refresh: () => loadData(true),
    isFromCache: !isOnline && !!data,
  };
};
