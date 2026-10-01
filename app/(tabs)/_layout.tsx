import { Tabs } from 'expo-router';
import { Hop as Home, MessageCircleHeart, BookHeart, Compass, User } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0C10',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: { fontFamily: 'Inter-Medium', fontSize: 11 },
        tabBarActiveTintColor: colors.rose,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="session"
        options={{ title: 'Sessao', tabBarIcon: ({ color, size }) => <MessageCircleHeart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: 'Diario', tabBarIcon: ({ color, size }) => <BookHeart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="cycles"
        options={{ title: 'Ciclos', tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tabs>
  );
}
