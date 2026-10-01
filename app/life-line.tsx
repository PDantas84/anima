import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Plus, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

const categories = ['Infancia', 'Familia', 'Perda', 'Trauma', 'Conquista', 'Mudanca', 'Relacionamento', 'Ruptura', 'Renascimento'];

export default function LifeLine() {
  const { session } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState('');
  const [belief, setBelief] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!session) return;
    const { data } = await supabase.from('life_events').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (data) setEvents(data);
  };

  useEffect(() => { load(); }, [session]);

  const save = async () => {
    if (!session || !title.trim()) return;
    setSaving(true);
    await supabase.from('life_events').insert({
      user_id: session.user.id,
      title, age_or_year: age, category, description, emotion, belief_created: belief,
    });
    setTitle(''); setAge(''); setDescription(''); setEmotion(''); setBelief('');
    setSaving(false);
    setOpen(false);
    load();
  };

  return (
    <AnimaScreen>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={colors.textMuted} size={18} />
        <Text style={typography.small}>Voltar</Text>
      </Pressable>
      <View style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Linha da Vida</Text>
        <Text style={typography.h1}>A sua historia em marcos</Text>
        <Text style={typography.body}>Cada marco carrega uma emocao, uma crenca e um padrao. Voce pode ressignificar cada um.</Text>
      </View>

      {!open ? (
        <Pressable onPress={() => setOpen(true)} style={styles.newBtn}>
          <Plus color={colors.bg} size={18} />
          <Text style={[typography.bodyStrong, { color: colors.bg }]}>Adicionar marco</Text>
        </Pressable>
      ) : (
        <>
          <AnimaInput label="Titulo" value={title} onChangeText={setTitle} />
          <AnimaInput label="Idade ou ano" value={age} onChangeText={setAge} />
          <View style={{ gap: spacing.sm }}>
            <Text style={typography.label}>Categoria</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {categories.map((c) => {
                const active = category === c;
                return (
                  <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <AnimaInput label="Descricao" value={description} onChangeText={setDescription} multiline />
          <AnimaInput label="Emocao principal" value={emotion} onChangeText={setEmotion} />
          <AnimaInput label="Crenca criada" value={belief} onChangeText={setBelief} multiline />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <AnimaButton variant="ghost" label="Cancelar" onPress={() => setOpen(false)} style={{ flex: 1 }} />
            <AnimaButton label="Guardar marco" onPress={save} loading={saving} style={{ flex: 1.2 }} />
          </View>
        </>
      )}

      {events.map((e) => (
        <AnimaCard key={e.id} style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MapPin color={colors.rose} size={14} />
            <Text style={[typography.small, { color: colors.goldSoft }]}>{e.category} | {e.age_or_year}</Text>
          </View>
          <Text style={typography.h3}>{e.title}</Text>
          {e.description ? <Text style={typography.body}>{e.description}</Text> : null}
          {e.belief_created ? <Text style={[typography.small, { color: colors.goldSoft, fontStyle: 'italic' }]}>Crenca: {e.belief_created}</Text> : null}
        </AnimaCard>
      ))}
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  newBtn: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.rose, padding: spacing.md, borderRadius: radius.pill,
  },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipText: { ...typography.small, color: colors.textSoft },
  chipTextActive: { color: colors.bg, fontFamily: 'Inter-SemiBold' },
});
