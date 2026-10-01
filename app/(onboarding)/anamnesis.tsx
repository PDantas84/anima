import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaMoodSelector } from '@/components/anima/AnimaMoodSelector';
import { anamnesisSections } from '@/data/anamnesis';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

type Answers = Record<string, Record<string, string>>;

export default function Anamnesis() {
  const { session } = useAuth();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [saving, setSaving] = useState(false);

  const section = anamnesisSections[sectionIdx];
  const total = anamnesisSections.length;
  const progress = useMemo(() => ((sectionIdx + 1) / total) * 100, [sectionIdx, total]);

  const setAnswer = (qid: string, v: string) => {
    setAnswers((a) => ({
      ...a,
      [section.id]: { ...(a[section.id] ?? {}), [qid]: v },
    }));
  };

  const onNext = async () => {
    if (sectionIdx < total - 1) {
      setSectionIdx(sectionIdx + 1);
      return;
    }
    if (!session) return;
    setSaving(true);
    const rows: any[] = [];
    for (const s of anamnesisSections) {
      for (const q of s.questions) {
        const a = answers[s.id]?.[q.id] ?? '';
        if (a) rows.push({
          user_id: session.user.id,
          section: s.title,
          question: q.text,
          answer: a,
          answer_type: q.type,
        });
      }
    }
    if (rows.length) await supabase.from('anamnesis_answers').insert(rows);
    setSaving(false);
    router.replace('/(onboarding)/soul-map');
  };

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={typography.label}>{section.overline} de {total}</Text>
        <Text style={typography.h1}>{section.title}</Text>
        <Text style={[typography.body, { fontStyle: 'italic', color: colors.goldSoft }]}>
          Respire. Nao existem respostas certas. Existe o que e verdade para voce agora.
        </Text>
      </View>

      <View style={{ gap: spacing.lg, marginTop: spacing.md }}>
        {section.questions.map((q) => {
          const v = answers[section.id]?.[q.id] ?? '';
          if (q.type === 'scale') {
            return (
              <View key={q.id} style={{ gap: spacing.sm }}>
                <Text style={typography.bodyStrong}>{q.text}</Text>
                <AnimaMoodSelector value={v ? Number(v) : 5} onChange={(n) => setAnswer(q.id, String(n))} />
              </View>
            );
          }
          if (q.type === 'choice') {
            return (
              <View key={q.id} style={{ gap: spacing.sm }}>
                <Text style={typography.bodyStrong}>{q.text}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {q.options?.map((opt) => {
                    const active = v === opt;
                    return (
                      <Pressable
                        key={opt}
                        onPress={() => setAnswer(q.id, opt)}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          }
          return (
            <AnimaInput
              key={q.id}
              label={q.text}
              value={v}
              onChangeText={(t) => setAnswer(q.id, t)}
              multiline
            />
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
        {sectionIdx > 0 && (
          <AnimaButton variant="ghost" label="Voltar" onPress={() => setSectionIdx(sectionIdx - 1)} style={{ flex: 1 }} />
        )}
        <AnimaButton
          label={sectionIdx === total - 1 ? 'Gerar Mapa de Alma' : 'Continuar'}
          onPress={onNext}
          loading={saving}
          style={{ flex: 1.3 }}
        />
      </View>
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  progress: { height: 3, backgroundColor: colors.surfaceAlt, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.rose },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipText: { ...typography.small, color: colors.textSoft },
  chipTextActive: { color: colors.bg, fontFamily: 'Inter-SemiBold' },
});
