import { useState, useEffect } from 'react';
import { OfflineManager } from '~/utils/offlineUtils';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const offlineManager = OfflineManager.getInstance();

  useEffect(() => {
    const handleOnlineStatusChange = (online: boolean) => {
      setIsOnline(online);
    };

    offlineManager.addListener(handleOnlineStatusChange);

    return () => {
      offlineManager.removeListener(handleOnlineStatusChange);
    };
  }, [offlineManager]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};
