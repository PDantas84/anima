import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useMobile } from '@/mobile/Store';
import { palette } from '@/mobile/theme';
export default function Index() {
  const { ready, state, error } = useMobile();
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: palette.background,
        }}
      >
        <ActivityIndicator
          color={palette.rose}
          accessibilityLabel="Abrindo seu espaço"
        />
      </View>
    );
  return (
    <Redirect
      href={error ? '/(tabs)/profile' : state.onboarded ? '/(tabs)' : '/intro'}
    />
  );
}
