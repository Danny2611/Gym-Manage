// src/components/pwa/PWAUpdatePrompt.tsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface PWAUpdatePromptProps {
  className?: string;
}

export const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ className = '' }) => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isUpdating) {
          setShowUpdatePrompt(true);
        }
      });

      // Check for waiting service worker
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          setShowUpdatePrompt(true);
        }
      });
    }
  }, [isUpdating]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      
      if (registration.waiting) {
        // Send message to waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating PWA:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900 mb-1">
              Cập nhật có sẵn
            </h3>
            <p className="text-xs text-green-700 mb-3">
              Phiên bản mới của ứng dụng đã sẵn sàng. Cập nhật ngay để có trải nghiệm tốt nhất.
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3" />
                    Cập nhật ngay
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                disabled={isUpdating}
                className="px-3 py-1.5 text-xs text-green-700 hover:text-green-800 disabled:opacity-50"
              >
                Để sau
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            disabled={isUpdating}
            className="flex-shrink-0 p-1 hover:bg-green-100 rounded-md disabled:opacity-50"
          >
            <X className="w-4 h-4 text-green-400" />
          </button>
        </div>
      </div>
    </div>
  );
};