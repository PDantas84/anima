import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { ArrowUp, BookOpen, Plus, Sparkles } from 'lucide-react-native';
import { guidedReply } from '@/domain/conversation';
import { Button, Card, IconButton, Screen, common } from '../components/UI';
import { Mark } from '../components/Artwork';
import { palette, fonts, type } from '../theme';
import { useMobile } from '../Store';
type Message = {
  id: string;
  role: 'guide' | 'user';
  content: string;
  urgent?: boolean;
};
const intentions = [
  [
    'Acolher meu dia',
    'O que ficou mais presente do seu dia? Você pode começar por um pequeno detalhe.',
  ],
  [
    'Organizar o que sinto',
    'Se o que você sente tivesse algumas palavras, quais seriam? Não precisa encontrar uma explicação.',
  ],
  [
    'Pensar em um próximo passo',
    'Que situação você gostaria de olhar com mais calma?',
  ],
  [
    'Só colocar para fora',
    'Este espaço está aberto. O que você quer colocar em palavras hoje?',
  ],
];
export default function Session() {
  const { update, saving } = useMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [intention, setIntention] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const journalId = useRef<string | null>(null);
  const list = useRef<FlatList<Message>>(null);
  const urgent = messages.some((m) => m.urgent);
  const turns = messages.filter((m) => m.role === 'user').length;
  const finished = turns >= 3 || urgent;
  function start(name: string, question: string) {
    setIntention(name);
    setMessages([
      { id: Crypto.randomUUID(), role: 'guide', content: question },
    ]);
  }
  function send() {
    const text = draft.trim();
    if (!text || finished) return;
    const reply = guidedReply(text, turns);
    setMessages((m) => [
      ...m,
      { id: Crypto.randomUUID(), role: 'user', content: text },
      {
        id: Crypto.randomUUID(),
        role: 'guide',
        content: reply.content,
        urgent: reply.urgent,
      },
    ]);
    setDraft('');
  }
  async function save() {
    const now = new Date().toISOString();
    const id = journalId.current ?? Crypto.randomUUID();
    const content = messages
      .map(
        (m) => `${m.role === 'user' ? 'Eu' : 'Reflexão guiada'}: ${m.content}`,
      )
      .join('\n\n');
    if (
      await update((s) => {
        const previous = s.entries.find((e) => e.id === id);
        return {
          ...s,
          entries: [
            {
              id,
              title: intention,
              content,
              mood: 3,
              createdAt: previous?.createdAt ?? now,
              updatedAt: now,
            },
            ...s.entries.filter((e) => e.id !== id),
          ],
        };
      }, 'A conversa foi guardada no diário.')
    ) {
      journalId.current = id;
      setSavedCount(messages.length);
    }
  }
  function reset() {
    const clear = () => {
      setMessages([]);
      setDraft('');
      setIntention('');
      setSavedCount(0);
      journalId.current = null;
    };
    if ((turns > 0 && savedCount !== messages.length) || draft.trim())
      Alert.alert(
        'Começar outra reflexão?',
        'O que não foi guardado no diário será descartado.',
        [
          { text: 'Continuar aqui', style: 'cancel' },
          { text: 'Começar outra', onPress: clear },
        ],
      );
    else clear();
  }
  return (
    <Screen
      title={messages.length ? 'Sua reflexão' : 'Um espaço de escuta'}
      eyebrow="CONVERSA GUIADA"
      scroll={messages.length === 0}
      action={
        messages.length ? (
          <IconButton
            label="Nova reflexão"
            onPress={reset}
            icon={<Plus size={22} color={palette.rose} />}
          />
        ) : undefined
      }
    >
      {!messages.length ? (
        <>
          <View style={s.welcome}>
            <View style={s.mark}>
              <Mark size={60} />
            </View>
            <Text style={s.invitation}>Por onde{'\n'}você quer começar?</Text>
            <Text style={[type.body, { textAlign: 'center' }]}>
              Às vezes, uma boa pergunta abre espaço para ouvir a si.
            </Text>
          </View>
          {intentions.map(([name, question]) => (
            <Button
              key={name}
              title={name}
              variant="secondary"
              onPress={() => start(name, question)}
              icon={<Sparkles size={17} color={palette.rose} />}
            />
          ))}
          <Card>
            <Text style={type.small}>
              Reflexões com respostas pré-escritas, sem IA conectada ou
              profissional do outro lado. A conversa só fica salva se você
              escolher guardar no diário.
            </Text>
            <Button
              title="Preciso de apoio humano"
              variant="ghost"
              onPress={() => router.push('/crisis')}
            />
          </Card>
        </>
      ) : (
        <>
          <Text style={[type.small, { marginTop: -10 }]}>
            Guia com respostas pré-escritas · {intention}
          </Text>
          <FlatList
            ref={list}
            data={messages}
            keyExtractor={(m) => m.id}
            onContentSizeChange={() =>
              list.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 18, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View
                style={[
                  s.bubble,
                  item.role === 'user' && s.userBubble,
                  item.urgent && s.urgent,
                ]}
              >
                <Text style={type.eyebrow}>
                  {item.role === 'user' ? 'VOCÊ' : 'ANIMA · REFLEXÃO'}
                </Text>
                <Text selectable style={[type.body, { color: palette.text }]}>
                  {item.content}
                </Text>
                {item.urgent && (
                  <Button
                    title="Encontrar apoio agora"
                    onPress={() => router.push('/crisis')}
                  />
                )}
              </View>
            )}
            ListFooterComponent={
              finished ? (
                <View style={{ gap: 12, marginTop: 18 }}>
                  <Text style={type.small}>
                    {urgent
                      ? 'Faça uma pausa na reflexão. Você merece companhia humana.'
                      : 'Pode ser suficiente por hoje. Leve consigo o que fez sentido.'}
                  </Text>
                  <Button
                    title={
                      savedCount === messages.length
                        ? 'Guardado no diário'
                        : 'Guardar conversa no diário'
                    }
                    onPress={save}
                    busy={saving}
                    disabled={savedCount === messages.length}
                    variant="secondary"
                    icon={<BookOpen size={18} color={palette.rose} />}
                  />
                  <Button
                    title="Começar outra reflexão"
                    variant="ghost"
                    onPress={reset}
                  />
                </View>
              ) : undefined
            }
          />
          {!finished && (
            <>
              <View style={s.composer}>
                <TextInput
                  accessibilityLabel="Sua mensagem"
                  placeholder="Escreva no seu tempo…"
                  placeholderTextColor={palette.quiet}
                  value={draft}
                  onChangeText={setDraft}
                  maxLength={2000}
                  multiline
                  style={s.input}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Enviar mensagem"
                  accessibilityState={{ disabled: !draft.trim() }}
                  disabled={!draft.trim()}
                  onPress={send}
                  style={[s.send, !draft.trim() && { opacity: 0.4 }]}
                >
                  <ArrowUp size={21} color={palette.ink} />
                </Pressable>
              </View>
              {turns > 0 && (
                <Button
                  title={
                    savedCount === messages.length
                      ? 'Conversa guardada'
                      : 'Guardar no diário'
                  }
                  disabled={savedCount === messages.length}
                  variant="ghost"
                  onPress={save}
                  busy={saving}
                  style={{ minHeight: 38, paddingVertical: 3, marginTop: -16 }}
                />
              )}
            </>
          )}
        </>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  welcome: { paddingVertical: 12, gap: 23, alignItems: 'center' },
  mark: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#392A38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.line,
  },
  invitation: {
    fontFamily: fonts.title,
    fontSize: 34,
    lineHeight: 44,
    color: palette.text,
    textAlign: 'center',
  },
  bubble: {
    padding: 19,
    gap: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    marginRight: 18,
  },
  userBubble: {
    backgroundColor: '#44313F',
    marginRight: 0,
    marginLeft: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 5,
  },
  urgent: { borderColor: '#AA7181' },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 10,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: '#756073',
    borderRadius: 23,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: palette.text,
    minHeight: 44,
    maxHeight: 130,
    padding: 10,
  },
  send: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: palette.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
