import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { Button, Card, Field, Screen, common } from '../components/UI';
import { useMobile } from '../Store';
import { useDraftExit } from '../hooks/useDraftExit';
import { palette, fonts, type } from '../theme';
export default function FutureSelf() {
  const { state, update, saving } = useMobile();
  const [letter, setLetter] = useState(state.profile.futureLetter);
  const dirty = letter !== state.profile.futureLetter;
  useDraftExit(dirty);
  return (
    <Screen title="Para quem vou ser" eyebrow="UMA CARTA PARA O FUTURO" back>
      <View style={{ alignItems: 'center', padding: 24, gap: 20 }}>
        <Send size={34} strokeWidth={1.2} color={palette.rose} />
        <Text
          style={[
            type.heading,
            { fontFamily: fonts.italic, textAlign: 'center' },
          ]}
        >
          Talvez, um dia, você precise{'\n'}ouvir quem é hoje.
        </Text>
      </View>
      <Card>
        <Text style={type.body}>
          Que palavras você gostaria de encontrar daqui a algum tempo? Conte o
          que está vivendo, o que deseja preservar e o que espera cuidar.
        </Text>
        <Text style={type.small}>
          A carta fica disponível aqui para reler. Não há envio ou lembrete
          automático.
        </Text>
      </Card>
      <Field
        label="Minha carta"
        placeholder="Querido eu do futuro…"
        multiline
        maxLength={12000}
        value={letter}
        onChangeText={setLetter}
        style={{ minHeight: 310 }}
      />
      <Text style={[type.small, { textAlign: 'right' }]}>
        {letter.length.toLocaleString('pt-BR')} / 12.000
      </Text>
      <Button
        title="Guardar minha carta"
        busy={saving}
        disabled={!dirty}
        onPress={() => {
          void update(
            (s) => ({ ...s, profile: { ...s.profile, futureLetter: letter } }),
            'Sua carta está guardada.',
          );
        }}
      />
      <Text style={common.note}>Você pode editar e reler quando quiser.</Text>
    </Screen>
  );
}
