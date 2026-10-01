import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  Home,
  MessageCircle,
  Sprout,
  UserRound,
} from 'lucide-react-native';
import { palette, fonts } from '@/mobile/theme';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.rose,
        tabBarInactiveTintColor: palette.quiet,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#211C25',
          borderTopColor: palette.line,
          height: 65 + Math.max(insets.bottom, 8),
          paddingTop: 9,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 10,
          marginTop: 3,
        },
        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color }) => <Home color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          title: 'Conversa',
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Diário',
          tabBarIcon: ({ color }) => <BookOpen color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="cycles"
        options={{
          title: 'Jornada',
          tabBarIcon: ({ color }) => <Sprout color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Meu espaço',
          tabBarIcon: ({ color }) => <UserRound color={color} size={21} />,
        }}
      />
    </Tabs>
  );
}
