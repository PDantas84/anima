import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Send, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { animaReply, detectRisk } from '@/services/anima';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

type Msg = { id: string; role: 'user' | 'anima'; content: string };

const intentions = [
  'Entender o que estou sentindo',
  'Organizar meus pensamentos',
  'Sair de um ciclo repetitivo',
  'Receber uma tarefa pratica',
  'Conversar com meu Eu Futuro',
  'Registrar uma dor',
  'Receber confronto gentil',
];

export default function Session() {
  const { session } = useAuth();
  const [intent, setIntent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const start = (i: string) => {
    setIntent(i);
    const greeting = `Querida, fico com voce agora. Entendi que voce quer ${i.toLowerCase()}. Nao tem pressa. Me conta devagar o que esta vivo ai dentro neste momento.`;
    setMessages([{ id: 'm0', role: 'anima', content: greeting }]);
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    if (detectRisk(text) && session) {
      await supabase.from('risk_events').insert({
        user_id: session.user.id,
        source: 'session',
        risk_level: 'high',
        detected_terms: [text.slice(0, 200)],
        action_taken: 'redirect_to_crisis',
      });
      setTimeout(() => router.push('/crisis'), 600);
    }

    setTimeout(() => {
      const reply = animaReply(text, { archetype: 'a Guardia da Dor', mask: 'Forte Doce' });
      const animaMsg: Msg = { id: `a-${Date.now()}`, role: 'anima', content: reply };
      setMessages((m) => [...m, animaMsg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
  };

  if (!intent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Text style={typography.label}>Sessao ANIMA</Text>
          <Text style={typography.h1}>O que voce precisa hoje?</Text>
          <Text style={typography.body}>Escolha uma intencao. Isso ajuda sua Presenca-Guia a te escutar com mais cuidado.</Text>
        </View>
        <FlatList
          data={intentions}
          keyExtractor={(i) => i}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          renderItem={({ item }) => (
            <Pressable onPress={() => start(item)} style={styles.intent}>
              <Sparkles color={colors.goldSoft} size={16} />
              <Text style={[typography.bodyStrong, { flex: 1 }]}>{item}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={['#14101A', '#09090B']} style={styles.header}>
        <View>
          <Text style={typography.label}>Em sessao</Text>
          <Text style={typography.h3}>{intent}</Text>
        </View>
        <Pressable onPress={() => { setIntent(null); setMessages([]); }}>
          <Text style={[typography.small, { color: colors.goldSoft }]}>Encerrar</Text>
        </Pressable>
      </LinearGradient>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userB : styles.animaB]}>
            <Text style={[typography.body, item.role === 'user' && { color: colors.bg }]}>{item.content}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Conte para a ANIMA..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
          />
          <Pressable onPress={send} style={styles.sendBtn}>
            <Send color={colors.bg} size={18} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  intent: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  bubble: { padding: spacing.md, borderRadius: radius.lg, maxWidth: '88%' },
  userB: { alignSelf: 'flex-end', backgroundColor: colors.rose, borderBottomRightRadius: 4 },
  animaB: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg,
  },
  input: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
    color: colors.text, fontFamily: 'Inter-Regular', fontSize: 15, maxHeight: 120,
    borderWidth: 1, borderColor: colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: radius.pill,
    backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center',
  },
});
