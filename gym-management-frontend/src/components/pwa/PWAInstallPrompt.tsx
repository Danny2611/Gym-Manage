// src/components/pwa/PWAInstallPrompt.tsx
import React from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '~/hooks/usePWA';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const {
    showInstallPrompt,
    isLoading,
    promptInstall,
    dismissInstallPrompt
  } = usePWA();

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Cài đặt FitLife App
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Cài đặt ứng dụng để trải nghiệm tốt hơn với chế độ offline và thông báo push.
            </p>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Smartphone className="w-3 h-3" />
                Mobile
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Monitor className="w-3 h-3" />
                Desktop
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                Cài đặt
              </button>
              
              <button
                onClick={dismissInstallPrompt}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
              >
                Để sau
              </button>
            </div>
          </div>
          
          <button
            onClick={dismissInstallPrompt}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

