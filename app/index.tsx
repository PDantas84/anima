import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography } from '@/constants/theme';

export default function Splash() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      if (session) router.replace('/(tabs)');
      else router.replace('/intro');
    }, 1400);
    return () => clearTimeout(t);
  }, [session, loading]);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#1A0F16', '#09090B', '#0B0A10']}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.title}>ANIMA</Text>
      <Text style={styles.subtitle}>Reconstrucao interior guiada por IA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { ...typography.display, fontSize: 44, letterSpacing: 8, color: colors.ivory },
  subtitle: { ...typography.small, color: colors.roseDeep, letterSpacing: 2, textTransform: 'uppercase' },
});
