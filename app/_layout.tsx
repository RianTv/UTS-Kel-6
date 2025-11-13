import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// [INTEGRASI] 1. Impor Transaction Provider Anda
// Path ini berasumsi folder 'context' Anda ada di root (luar folder 'app')
import { TransactionProvider } from '../context/TransactionContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* [INTEGRASI] 2. Bungkus seluruh navigasi (Stack) dengan Provider */}
      <TransactionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* [INTEGRASI] 3. Ganti "modal" menjadi "addTransaction" */}
          <Stack.Screen 
            name="addTransaction" 
            options={{ 
              presentation: 'modal', 
              // Sembunyikan header default agar header kustom di halaman itu tampil
              headerShown: false 
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </TransactionProvider>
    </ThemeProvider>
  );
}