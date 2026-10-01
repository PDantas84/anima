import React from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Screen } from '@/mobile/components/UI';
import { type } from '@/mobile/theme';
export default function NotFound() {
  return (
    <Screen title="Vamos encontrar o caminho" back>
      <Text style={type.body}>Essa página não está disponível.</Text>
      <Button
        title="Voltar ao meu espaço"
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}
