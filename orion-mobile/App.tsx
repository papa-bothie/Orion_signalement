import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalErrorBoundary } from './src/components/shared/GlobalErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
}
