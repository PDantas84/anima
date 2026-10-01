import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Plus, BookHeart } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaMoodSelector } from '@/components/anima/AnimaMoodSelector';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { detectRisk } from '@/services/anima';
import { router } from 'expo-router';
import { colors, radius, spacing, typography } from '@/constants/theme';

type Entry = {
  id: string;
  mood_score: number;
  energy_score: number;
  body_tension_score: number;
  content: string;
  created_at: string;
  perceived_pattern: string;
};

export default function Journal() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [tension, setTension] = useState(5);
  const [content, setContent] = useState('');
  const [pattern, setPattern] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!session) return;
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (data) setEntries(data as any);
  };

  useEffect(() => { load(); }, [session]);

  const save = async () => {
    if (!session || !content.trim()) return;
    setSaving(true);
    if (detectRisk(content)) {
      await supabase.from('risk_events').insert({
        user_id: session.user.id,
        source: 'journal',
        risk_level: 'high',
        detected_terms: [content.slice(0, 200)],
        action_taken: 'redirect_to_crisis',
      });
      setSaving(false);
      router.push('/crisis');
      return;
    }
    await supabase.from('journal_entries').insert({
      user_id: session.user.id,
      mood_score: mood,
      energy_score: energy,
      body_tension_score: tension,
      content,
      perceived_pattern: pattern,
    });
    setContent(''); setPattern(''); setMood(5); setEnergy(5); setTension(5);
    setSaving(false);
    setOpen(false);
    load();
  };

  if (open) {
    return (
      <AnimaScreen>
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          <Text style={typography.label}>Nova entrada</Text>
          <Text style={typography.h1}>Registre sua travessia</Text>
          <Text style={typography.body}>Nao precisa ser bonito. Precisa ser verdadeiro.</Text>
        </View>
        <AnimaMoodSelector label="Humor" value={mood} onChange={setMood} />
        <AnimaMoodSelector label="Energia" value={energy} onChange={setEnergy} />
        <AnimaMoodSelector label="Tensao no corpo" value={tension} onChange={setTension} />
        <AnimaInput label="O que esta vivo em voce hoje" value={content} onChangeText={setContent} multiline />
        <AnimaInput label="Algum padrao percebido" value={pattern} onChangeText={setPattern} multiline />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <AnimaButton variant="ghost" label="Cancelar" onPress={() => setOpen(false)} style={{ flex: 1 }} />
          <AnimaButton label="Guardar" onPress={save} loading={saving} style={{ flex: 1.2 }} />
        </View>
      </AnimaScreen>
    );
  }

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>Seu refugio</Text>
        <Text style={typography.h1}>Diario da Travessia</Text>
        <Text style={typography.body}>Um espaco so seu para nomear o que a mente quer esconder.</Text>
      </View>

      <Pressable onPress={() => setOpen(true)} style={styles.newBtn}>
        <Plus color={colors.bg} size={18} />
        <Text style={[typography.bodyStrong, { color: colors.bg }]}>Nova entrada</Text>
      </Pressable>

      {entries.length === 0 ? (
        <AnimaCard style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl }}>
          <BookHeart color={colors.roseDeep} size={28} />
          <Text style={typography.bodyStrong}>Ainda nao ha entradas.</Text>
          <Text style={[typography.small, { textAlign: 'center' }]}>Comece com uma frase curta. Seu diario te espera sem julgamento.</Text>
        </AnimaCard>
      ) : (
        entries.map((e) => (
          <AnimaCard key={e.id} style={{ gap: spacing.sm }}>
            <Text style={typography.label}>{new Date(e.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pill label={`Humor ${e.mood_score}`} />
              <Pill label={`Energia ${e.energy_score}`} />
              <Pill label={`Tensao ${e.body_tension_score}`} />
            </View>
            <Text style={typography.body}>{e.content}</Text>
            {e.perceived_pattern ? (
              <Text style={[typography.small, { color: colors.goldSoft, fontStyle: 'italic' }]}>Padrao: {e.perceived_pattern}</Text>
            ) : null}
          </AnimaCard>
        ))
      )}
    </AnimaScreen>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={[typography.small, { color: colors.goldSoft }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  newBtn: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.rose, padding: spacing.md, borderRadius: radius.pill,
  },
  pill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill,
    backgroundColor: '#201620', borderWidth: 1, borderColor: '#3A2A36',
  },
});
