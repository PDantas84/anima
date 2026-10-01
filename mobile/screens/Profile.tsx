import React, { useEffect, useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import { router } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {
  Download,
  HeartHandshake,
  LockKeyhole,
  Map,
  Send,
  Upload,
} from 'lucide-react-native';
import { parseState } from '@/domain/model';
import { useMobile } from '../Store';
import { Button, Card, Field, Screen, Section, common } from '../components/UI';
import { Mark } from '../components/Artwork';
import { palette, type } from '../theme';
export default function Profile() {
  const { state, update, reset, restore, saving, error, raw } = useMobile();
  const [name, setName] = useState(state.profile.name);
  const [intention, setIntention] = useState(state.profile.intention);
  const [transferring, setTransferring] = useState(false);
  useEffect(() => {
    setName(state.profile.name);
    setIntention(state.profile.intention);
  }, [state.profile.name, state.profile.intention]);
  async function exportData() {
    setTransferring(true);
    try {
      if (!(await Sharing.isAvailableAsync()))
        throw new Error(
          'O compartilhamento não está disponível neste aparelho.',
        );
      const content = error ? await raw() : JSON.stringify(state, null, 2);
      if (!content)
        throw new Error('Nenhum dado foi encontrado para exportar.');
      const file = new File(
        Paths.cache,
        error ? 'anima-recuperacao.json' : 'anima-backup.json',
      );
      file.write(content);
      try {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/json',
          UTI: 'public.json',
          dialogTitle: 'Guardar backup do Anima',
        });
      } finally {
        if (file.exists) file.delete();
      }
    } catch (e) {
      Alert.alert(
        'Não foi possível exportar',
        e instanceof Error ? e.message : 'Tente novamente.',
      );
    } finally {
      setTransferring(false);
    }
  }
  async function importData() {
    setTransferring(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain'],
        // Android grants access to the selected content URI. Expo Go's picker
        // cache is outside its scoped FileSystem directory in SDK 57.
        copyToCacheDirectory: Platform.OS !== 'android',
        multiple: false,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const file = new File(asset.uri);
      try {
        if ((asset.size ?? file.size ?? 0) > 10 * 1024 * 1024)
          throw new Error('O limite para o backup é de 10 MB.');
        const parsed = parseState(JSON.parse(await file.text()));
        if (!parsed)
          throw new Error('Este arquivo não é um backup válido do Anima.');
        Alert.alert(
          'Restaurar este backup?',
          `O arquivo contém ${parsed.entries.length} registros e ${parsed.checkIns.length} check-ins. Ele substituirá os dados atuais deste aparelho.`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Restaurar',
              onPress: () => {
                void restore({ ...parsed, onboarded: true });
              },
            },
          ],
        );
      } finally {
        // Only remove the temporary iOS copy, never the user's Android file.
        if (Platform.OS !== 'android' && file.exists) file.delete();
      }
    } catch (e) {
      Alert.alert(
        'Backup não importado',
        e instanceof Error
          ? e.message
          : 'Escolha um arquivo JSON exportado pelo Anima.',
      );
    } finally {
      setTransferring(false);
    }
  }
  function erase() {
    Alert.alert(
      'Apagar todos os dados?',
      'Diário, jornadas, rituais, carta e perfil serão apagados deste aparelho. Essa ação não pode ser desfeita. Exporte um backup antes, se quiser guardar uma cópia.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            if (await reset()) router.replace('/intro');
          },
        },
      ],
    );
  }
  const changed =
    name.trim() !== state.profile.name ||
    intention.trim() !== state.profile.intention;
  return (
    <Screen title="Meu espaço" eyebrow="DO SEU JEITO">
      <Card>
        <View style={common.row}>
          <Mark size={47} />
          <View style={{ flex: 1 }}>
            <Text style={type.heading}>
              {state.profile.name || 'Um lugar para você'}
            </Text>
            <Text style={type.small}>Sem pressa. Sem comparação.</Text>
          </View>
        </View>
        <Field
          label="Seu nome"
          value={name}
          onChangeText={setName}
          maxLength={60}
          placeholder="Como gosta de ser chamado?"
        />
        <Field
          label="Sua intenção"
          value={intention}
          onChangeText={setIntention}
          maxLength={160}
          placeholder="O que você quer cultivar?"
        />
        <Button
          title="Guardar preferências"
          busy={saving}
          disabled={!changed || !!error}
          onPress={() => {
            void update(
              (s) => ({
                ...s,
                profile: {
                  ...s.profile,
                  name: name.trim(),
                  intention: intention.trim(),
                },
              }),
              'Seu espaço foi atualizado.',
            );
          }}
        />
      </Card>
      <Section title="Seu caminho" />
      <Button
        title="Meu mapa de presença"
        variant="secondary"
        icon={<Map size={20} color={palette.rose} />}
        onPress={() => router.push('/soul-map')}
      />
      <Button
        title="Uma carta para meu futuro"
        variant="secondary"
        icon={<Send size={20} color={palette.rose} />}
        onPress={() => router.push('/future-self')}
      />
      <Section title="Privacidade nas suas mãos" />
      <Card>
        <LockKeyhole size={25} color={palette.sage} />
        <Text style={type.subheading}>Seus registros ficam no celular</Text>
        <Text style={type.body}>
          O Anima funciona sem conta e sem internet. Seus textos não são
          enviados a um servidor ou a uma IA. Não há sincronização entre
          aparelhos.
        </Text>
        <Text style={type.small}>
          Este MVP armazena dados localmente, sem criptografia própria. Quem
          tiver acesso ao aparelho desbloqueado poderá ler seus registros. Os
          backups são arquivos JSON legíveis; escolha com cuidado onde
          guardá-los.
        </Text>
        <Text style={type.small}>
          Desinstalar o app ou apagar seus dados pode remover os registros.
          Guarde um backup antes de trocar de aparelho.
        </Text>
        <Button
          title={error ? 'Exportar dados para recuperação' : 'Exportar backup'}
          variant="secondary"
          busy={transferring}
          disabled={saving}
          onPress={exportData}
          icon={<Upload size={19} color={palette.rose} />}
        />
        <Button
          title="Importar backup"
          variant="secondary"
          disabled={transferring || saving}
          onPress={importData}
          icon={<Download size={19} color={palette.rose} />}
        />
      </Card>
      <Card>
        <HeartHandshake color={palette.rose} size={25} />
        <Text style={type.subheading}>Você merece apoio humano</Text>
        <Text style={type.body}>
          O Anima é uma ferramenta de reflexão. Não faz diagnóstico, não oferece
          terapia e não acompanha emergências.
        </Text>
        <Button
          title="Encontrar apoio"
          variant="secondary"
          onPress={() => router.push('/crisis')}
        />
      </Card>
      <Button
        title="Apagar todos os meus dados"
        variant="danger"
        disabled={saving || transferring}
        onPress={erase}
      />
      <Text style={common.note}>
        ANIMA · MVP MOBILE 0.2.0{'\n'}Feito para respeitar o seu tempo.
      </Text>
    </Screen>
  );
}
