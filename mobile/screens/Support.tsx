import React from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { ExternalLink, HeartHandshake, Phone } from 'lucide-react-native';
import { Button, Card, Screen, common } from '../components/UI';
import { palette, type } from '../theme';
async function open(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Não foi possível abrir',
      url.startsWith('tel:')
        ? `Use o telefone do aparelho para ligar ${url.slice(4)}.`
        : 'Abra o site cvv.org.br no navegador do aparelho.',
    );
  }
}
export default function Support() {
  return (
    <Screen
      title="Você não precisa passar por isso só"
      eyebrow="APOIO HUMANO"
      back
      action={<HeartHandshake color={palette.rose} size={26} />}
    >
      <Text style={type.body}>
        Se puder, procure uma pessoa de confiança e diga que precisa de
        companhia. Você merece ser ouvido.
      </Text>
      <Card style={{ backgroundColor: '#412B35', borderColor: '#91606E' }}>
        <Text style={type.eyebrow}>PERIGO IMEDIATO · BRASIL</Text>
        <Text style={type.heading}>SAMU · 192</Text>
        <Text style={type.body}>
          Se houver risco imediato à sua vida, se você já tiver se ferido ou
          ingerido algo perigoso, ligue para o SAMU ou vá a uma emergência.
        </Text>
        <Button
          title="Ligar 192"
          onPress={() => {
            void open('tel:192');
          }}
          icon={<Phone size={19} color={palette.ink} />}
        />
      </Card>
      <Card>
        <Text style={type.eyebrow}>PARA CONVERSAR · BRASIL</Text>
        <Text style={type.heading}>CVV · 188</Text>
        <Text style={type.body}>
          Apoio emocional gratuito e sigiloso, por telefone, 24 horas por dia.
        </Text>
        <Button
          title="Ligar 188"
          onPress={() => {
            void open('tel:188');
          }}
          icon={<Phone size={19} color={palette.ink} />}
        />
        <Button
          title="Visitar o site do CVV"
          variant="secondary"
          onPress={() => {
            void open('https://cvv.org.br/');
          }}
          icon={<ExternalLink size={18} color={palette.rose} />}
        />
      </Card>
      <Card>
        <Text style={type.heading}>Uma pessoa perto de você</Text>
        <Text style={type.body}>
          Se for possível e seguro, envie uma mensagem ou ligue para alguém de
          confiança. Você pode dizer:
        </Text>
        <Text selectable style={[type.body, { color: palette.rose }]}>
          “Não estou bem e preciso de companhia. Você pode falar comigo ou ficar
          perto de mim agora?”
        </Text>
      </Card>
      <Text style={common.note}>
        Fora do Brasil, use o número de emergência local.{'\n'}O Anima não
        monitora mensagens nem aciona serviços por você.
      </Text>
    </Screen>
  );
}
