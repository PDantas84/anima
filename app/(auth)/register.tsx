import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/constants/theme';

export default function Register() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (password.length < 6) {
      setError('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (error) setError(error);
    else router.replace('/(onboarding)/safety');
  };

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text style={typography.label}>Inicio da travessia</Text>
        <Text style={typography.display}>Seja bem-vinda.</Text>
        <Text style={typography.body}>Ainda nao sei seu nome. Mas ja posso te ouvir. Vamos criar sua presenca aqui dentro.</Text>
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <AnimaInput label="Como quer ser chamada" value={name} onChangeText={setName} />
        <AnimaInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <AnimaInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        {error && <Text style={styles.err}>{error}</Text>}
        <AnimaButton label="Comecar travessia" onPress={onSubmit} loading={loading} />
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.link}>Ja tenho conta</Text>
        </Pressable>
      </View>
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  err: { ...typography.small, color: colors.danger },
  link: { ...typography.small, color: colors.goldSoft, textAlign: 'center', marginTop: spacing.sm },
});
