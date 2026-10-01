import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MobileProvider } from '@/mobile/Store';
import { palette } from '@/mobile/theme';
SplashScreen.preventAutoHideAsync().catch(() => {});
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    InterMedium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Playfair: require('@expo-google-fonts/playfair-display/400Regular/PlayfairDisplay_400Regular.ttf'),
    PlayfairItalic: require('@expo-google-fonts/playfair-display/400Regular_Italic/PlayfairDisplay_400Regular_Italic.ttf'),
  });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <MobileProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="intro" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="entry" options={{ presentation: 'modal' }} />
            <Stack.Screen name="crisis" options={{ presentation: 'modal' }} />
          </Stack>
        </MobileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
