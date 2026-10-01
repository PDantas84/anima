import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { BookOpen, Plus, Search, ArrowUpRight } from 'lucide-react-native';
import { Screen, Button, Card, Empty, common } from '../components/UI';
import { Face } from '../components/Artwork';
import { useMobile } from '../Store';
import { palette, fonts, type } from '../theme';
import { Entry, Mood, moodLabels } from '@/domain/model';
export default function Journal() {
  const { state } = useMobile();
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const entries = useMemo(
    () =>
      state.entries
        .filter(
          (e) =>
            (!mood || mood === e.mood) &&
            `${e.title} ${e.content}`
              .toLocaleLowerCase('pt-BR')
              .includes(query.toLocaleLowerCase('pt-BR').trim()),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.entries, query, mood],
  );
  function renderEntry({ item }: { item: Entry }) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${item.title || 'Sem título'}`}
        onPress={() =>
          router.push({ pathname: '/entry', params: { id: item.id } })
        }
      >
        <Card>
          <View style={[common.row, { justifyContent: 'space-between' }]}>
            <Text style={type.eyebrow}>
              {new Date(item.createdAt)
                .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
                .toUpperCase()}
            </Text>
            <Face mood={item.mood} size={27} />
          </View>
          <Text style={type.heading}>{item.title || 'Sem título'}</Text>
          <Text numberOfLines={3} style={type.body}>
            {item.content}
          </Text>
          <View style={[common.row, { justifyContent: 'space-between' }]}>
            <Text style={type.small}>{moodLabels[item.mood]}</Text>
            <ArrowUpRight size={18} color={palette.rose} />
          </View>
        </Card>
      </Pressable>
    );
  }
  return (
    <Screen
      title="Seu diário"
      eyebrow="PALAVRAS QUE ACOLHEM"
      description="Tudo o que você sente merece um lugar."
      scroll={false}
    >
      <Button
        title="Novo registro"
        onPress={() => router.push('/entry')}
        icon={<Plus size={18} color={palette.ink} />}
      />
      <View style={s.search}>
        <Search size={19} color={palette.muted} />
        <TextInput
          accessibilityLabel="Buscar no diário"
          placeholder="Buscar nas suas palavras…"
          placeholderTextColor={palette.quiet}
          value={query}
          onChangeText={setQuery}
          style={s.searchInput}
          returnKeyType="search"
        />
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mood === null }}
            onPress={() => setMood(null)}
            style={[s.chip, mood === null && s.selected]}
          >
            <Text style={type.small}>Todos</Text>
          </Pressable>
          {([1, 2, 3, 4, 5] as Mood[]).map((m) => (
            <Pressable
              key={m}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por ${moodLabels[m]}`}
              accessibilityState={{ selected: mood === m }}
              onPress={() => setMood(m)}
              style={[s.chip, mood === m && s.selected]}
            >
              <Text style={type.small}>{moodLabels[m]}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        renderItem={renderEntry}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingBottom: 24 }}
        ListEmptyComponent={
          <Empty
            icon={<BookOpen size={30} color={palette.rose} />}
            title={
              state.entries.length
                ? 'Nenhum registro por aqui'
                : 'Uma página aberta para você'
            }
            description={
              state.entries.length
                ? 'Experimente outra palavra ou retire o filtro de humor.'
                : 'Pode ser uma frase, uma sensação ou um dia inteiro. Comece como puder.'
            }
            action={
              state.entries.length ? (
                <Button
                  title="Limpar filtros"
                  variant="secondary"
                  onPress={() => {
                    setMood(null);
                    setQuery('');
                  }}
                />
              ) : (
                <Button
                  title="Escrever minha primeira página"
                  variant="secondary"
                  onPress={() => router.push('/entry')}
                />
              )
            }
          />
        }
      />
    </Screen>
  );
}
const s = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.surface,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontFamily: fonts.body,
    fontSize: 14,
    paddingVertical: 13,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.line,
    minHeight: 44,
  },
  selected: { backgroundColor: '#4B3746', borderColor: '#9A7989' },
});
