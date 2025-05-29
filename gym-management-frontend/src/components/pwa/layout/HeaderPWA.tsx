// src/components/layout/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Apple, Settings, Bell } from 'lucide-react';
import { NotificationButton } from '~/components/pwa/NotificationButton';

import { usePushNotifications } from '~/hooks/usePushNotifications';


interface HeaderProps {
  onNotificationClick?: () => void;
  showBottomNav?: boolean;
  navItems?: Array<{
    path: string;
    icon: any;
    label: string;
  }>;
}

export const HeaderPWA: React.FC<HeaderProps> = ({
  onNotificationClick,
  showBottomNav = false,
  navItems = [
    { path: '/user/dashboard', icon: Home, label: 'Trang chủ' },
    { path: '/user/workout', icon: Dumbbell, label: 'Tập luyện' },
    { path: '/user/packages', icon: Apple, label: 'Gói tập' },
    { path: '/user/profile', icon: Settings, label: 'Cài đặt' },
  ]
}) => {
  const location = useLocation();
  const { isSupported,  isSubscribed, unreadCount } = usePushNotifications();
//  const isNotificationSupported = isPushNotificationSupported(); // ✅ ĐÚNG
  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">FitLife</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              {isSupported && onNotificationClick && (
                <button
                  onClick={onNotificationClick}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {isSubscribed && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Notification Toggle */}
              <NotificationButton />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation - chỉ hiện khi showBottomNav = true */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className={`grid h-16 ${navItems.length === 4 ? 'grid-cols-4' : `grid-cols-${navItems.length}`}`}>
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center justify-center space-y-1 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Desktop Sidebar - chỉ hiện khi có navItems */}
      {navItems.length > 0 && (
        <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:border-gray-200 md:pt-16 md:block">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};