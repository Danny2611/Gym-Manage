import React from 'react';
import { useOffline } from '~/hooks/useOffline';

const OfflineIndicator: React.FC = () => {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          Không có kết nối mạng - Đang sử dụng dữ liệu offline
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;