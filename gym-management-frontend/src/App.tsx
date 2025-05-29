// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProviderWithRouter } from './contexts/AuthContext';
import { register } from './registerServiceWorker';
import { PWAPushNotification } from './components/pwa/push-notification';
import Routes from './routes/index';

const App: React.FC = () => {
  useEffect(() => {
    // Register service worker
    register({
      onSuccess: (registration) => {
        console.log('Service Worker registered successfully:', registration);
      },
      onUpdate: (registration) => {
        console.log('Service Worker updated:', registration);
      }
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProviderWithRouter>
          <PWAPushNotification>
            <Routes />
          </PWAPushNotification>
        </AuthProviderWithRouter>
      </BrowserRouter>
    </div>
  );
};

export default App;