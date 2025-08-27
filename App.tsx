import './global.css';

import { NavigationContainerRef } from '@react-navigation/native';
import { useRef } from 'react';

import 'react-native-gesture-handler';

import Navigation from './navigation';
import { setNavigationRef, AuthProvider } from './context/AuthContext';

function AppContent() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <Navigation 
      ref={(ref) => {
        // Set the navigation reference for use in AuthContext
        if (ref) {
          setNavigationRef(ref);
        }
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
