import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Feather, Trash2 } from 'lucide-react-native';
import {
  Button,
  Card,
  Field,
  IconButton,
  MoodPicker,
  Screen,
  common,
} from '../components/UI';
import { palette, type } from '../theme';
import { useMobile, successHaptic } from '../Store';
import { useDraftExit } from '../hooks/useDraftExit';
import { Mood } from '@/domain/model';
import { journalPrompts } from '@/domain/content';
import { needsImmediateSupport } from '@/domain/conversation';
export default function EntryEditor() {
  const { id, prompt } = useLocalSearchParams<{
    id?: string;
    prompt?: string;
  }>();
  const { state, update, saving } = useMobile();
  const existing = state.entries.find((e) => e.id === id);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [mood, setMood] = useState<Mood>(existing?.mood ?? 3);
  const [selectedPrompt, setPrompt] = useState(
    prompt || journalPrompts[new Date().getDate() % journalPrompts.length],
  );
  const dirty =
    title !== (existing?.title ?? '') ||
    content !== (existing?.content ?? '') ||
    mood !== (existing?.mood ?? 3);
  const leave = useDraftExit(dirty);
  async function save() {
    if (!content.trim() || saving) return;
    const timestamp = new Date().toISOString();
    const entry = {
      id: existing?.id ?? Crypto.randomUUID(),
      title: title.trim() || 'Um momento meu',
      content: content.trim(),
      mood,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    const saved = await update(
      (s) => ({
        ...s,
        entries: [entry, ...s.entries.filter((e) => e.id !== entry.id)],
      }),
      'Seu registro foi guardado.',
    );
    if (saved) {
      successHaptic();
      if (needsImmediateSupport(content))
        Alert.alert(
          'Você pode buscar companhia agora',
          'Se houver perigo imediato, ligue 192. Para conversar, o CVV atende no 188. O Anima não acompanha emergências.',
          [
            { text: 'Voltar ao diário', onPress: leave },
            {
              text: 'Encontrar apoio',
              onPress: () => {
                leave();
                setTimeout(() => router.push('/crisis'), 350);
              },
            },
          ],
        );
      else leave();
    }
  }
  function remove() {
    if (!existing) return;
    Alert.alert(
      'Apagar este registro?',
      'Essa página será removida deste aparelho.',
      [
        { text: 'Manter', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            if (
              await update(
                (s) => ({
                  ...s,
                  entries: s.entries.filter((e) => e.id !== existing.id),
                }),
                'Registro apagado.',
              )
            )
              leave();
          },
        },
      ],
    );
  }
  if (id && !existing)
    return (
      <Screen title="Registro não encontrado" back>
        <Text style={type.body}>
          Essa página pode ter sido apagada ou substituída por um backup.
        </Text>
        <Button title="Ir para o diário" onPress={leave} />
      </Screen>
    );
  return (
    <Screen
      title={existing ? 'Suas palavras' : 'Uma página sua'}
      eyebrow={new Date(existing?.createdAt ?? Date.now())
        .toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
        .toUpperCase()}
      back
      action={
        existing ? (
          <IconButton
            label="Apagar registro"
            onPress={remove}
            icon={<Trash2 size={20} color={palette.danger} />}
          />
        ) : (
          <Feather size={23} color={palette.rose} />
        )
      }
    >
      <Field
        label="Título"
        placeholder="Que nome você daria a este momento?"
        value={title}
        onChangeText={setTitle}
        maxLength={120}
      />
      {!existing && (
        <Card style={{ backgroundColor: '#352A39', gap: 10 }}>
          <Text style={type.eyebrow}>SE PRECISAR DE UM COMEÇO</Text>
          <Text style={type.body}>{selectedPrompt}</Text>
          <Button
            title="Outra inspiração"
            variant="ghost"
            onPress={() =>
              setPrompt(
                journalPrompts[
                  (journalPrompts.indexOf(selectedPrompt) + 1) %
                    journalPrompts.length
                ],
              )
            }
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 0,
              minHeight: 44,
            }}
          />
        </Card>
      )}
      <Field
        label="O que você quer guardar?"
        placeholder="Este espaço é seu. Escreva sem pressa…"
        value={content}
        onChangeText={setContent}
        multiline
        maxLength={12000}
        style={{ minHeight: 240 }}
      />
      <Text style={[type.small, { textAlign: 'right', marginTop: -12 }]}>
        {content.length.toLocaleString('pt-BR')} / 12.000
      </Text>
      <View style={{ gap: 12 }}>
        <Text style={type.subheading}>Como você se sente ao escrever?</Text>
        <MoodPicker value={mood} onChange={setMood} />
      </View>
      <Button
        title="Guardar no diário"
        onPress={save}
        busy={saving}
        disabled={!content.trim()}
      />
      <Text style={common.note}>Salvo somente neste aparelho.</Text>
    </Screen>
  );
}
