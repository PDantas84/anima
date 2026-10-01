import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, usePreventRemove } from 'expo-router/react-navigation';
import { router } from 'expo-router';
export function useDraftExit(dirty: boolean) {
  const navigation = useNavigation();
  const [leaving, setLeaving] = useState(false);
  usePreventRemove(dirty && !leaving, ({ data }) =>
    Alert.alert(
      'Sair sem guardar?',
      'As alterações deste rascunho serão descartadas.',
      [
        { text: 'Continuar escrevendo', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    ),
  );
  useEffect(() => {
    if (leaving) {
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/journal');
    }
  }, [leaving]);
  return () => setLeaving(true);
}
