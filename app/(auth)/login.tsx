import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/constants/theme';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) setError(error);
    else router.replace('/(tabs)');
  };

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text style={typography.label}>Retorno</Text>
        <Text style={typography.display}>Voce voltou.</Text>
        <Text style={typography.body}>Continuemos de onde sua travessia parou.</Text>
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <AnimaInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <AnimaInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        {error && <Text style={styles.err}>{error}</Text>}
        <AnimaButton label="Entrar" onPress={onSubmit} loading={loading} />
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>Ainda nao tenho conta. Comecar travessia.</Text>
        </Pressable>
      </View>
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  err: { ...typography.small, color: colors.danger },
  link: { ...typography.small, color: colors.goldSoft, textAlign: 'center', marginTop: spacing.sm },
});
