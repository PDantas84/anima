# Anima · aplicativo mobile

MVP nativo de autocuidado para **Android e iOS**, baseado em [PDantas84/anima](https://github.com/PDantas84/anima). Construído com React Native 0.86, Expo SDK 57 e Expo Router. As telas usam componentes nativos; não há site, WebView ou interface HTML no aplicativo.

## O que funciona

- Onboarding com nome opcional e intenção pessoal, sem cadastro.
- Check-in diário de humor, atualizado sem duplicar o dia.
- Diário com criação, edição, exclusão confirmada, busca e filtro por humor.
- Três jornadas de sete encontros distintos, com progresso persistente e um encontro por dia.
- Seis rituais com favoritos, temporizador, pausa em segundo plano e registro de conclusão.
- Conversas de reflexão com respostas pré-escritas, opção de guardar no diário e acesso a apoio humano.
- Mapa calculado exclusivamente a partir dos registros reais e carta para o futuro editável.
- Backup JSON pelo compartilhamento nativo, importação pelo seletor de arquivos e exclusão dos dados mediante confirmação.
- Fontes embarcadas, ilustrações vetoriais, áreas seguras, navegação inferior, teclado e feedback tátil. A animação de respiração respeita a opção de reduzir movimentos do aparelho.

## Capturas do aplicativo instalado

Capturas reais do APK no emulador Android, com dados de exemplo e conexão desligada.

<img src="docs/android-home.png" width="250" alt="Tela inicial do Anima no Android" /> <img src="docs/android-conversation.png" width="250" alt="Conversa guiada nativa no Android" />

## Executar

### Instalar o APK entregue no Android

Transfira `anima-android.apk` para um celular com Android 7 ou posterior e abra o arquivo para instalar. Se o Android solicitar, permita a instalação pelo aplicativo usado para abrir esse arquivo. Depois, abra **Anima** pela tela de aplicativos. O APK inclui o código e as fontes; não precisa de Expo Go, computador ou conexão para os fluxos de autocuidado.

### Rodar o código-fonte

Requer Node.js 22.13 ou mais recente; a validação deste projeto usa Node 24.

```sh
npm ci
npm start
```

Abra no **Expo Go compatível com SDK 57**, em um iPhone ou Android. O modo padrão do Expo usa a rede local; computador e celular precisam alcançar o mesmo servidor. Para testar em emulador Android sem expor o servidor à rede:

```sh
npx expo start --android --localhost --port 8092
```

O Android SDK e um emulador iniciado são necessários para esse último comando. Em caso de conflito entre IPv4 e IPv6, use `NODE_OPTIONS=--dns-result-order=ipv4first` antes do comando. A porta pode ser alterada se estiver ocupada.

Para compilar localmente, instale Android Studio/SDK/JDK para Android ou Xcode para iOS:

```sh
npm run android
npm run ios
```

Nenhuma chave de API, conta Supabase ou servidor é necessário. A pasta `supabase/` preserva uma migração histórica do repositório de origem e não é usada pelo MVP local.

## Gerar aplicativo instalável

O projeto está vinculado a [@pabloads/anima no Expo](https://expo.dev/accounts/pabloads/projects/anima). Os perfis estão em `eas.json`.

```sh
# APK Android independente de Expo Go e do computador
npx eas-cli build --platform android --profile preview

# App para simulador iOS, sem assinatura de dispositivo
npx eas-cli build --platform ios --profile ios-simulator

# Instalação interna em iPhone: requer conta Apple e dispositivo registrado
npx eas-cli build --platform ios --profile preview
```

Não houve publicação em Google Play ou App Store. O arquivo `VALIDATION.md` distingue testes de código, execução em emulador e compilação nativa.

## Dados e limites do MVP

Os dados são salvos com AsyncStorage somente depois de uma gravação bem-sucedida. As gravações são serializadas para não perder alterações concorrentes. Falhas não fecham o editor nem descartam o rascunho. O app aguarda a leitura inicial antes de montar as telas, inclusive quando aberto por um link direto.

Backups e dados locais **não têm criptografia própria do aplicativo**. Backups JSON são legíveis. Não há login, biometria, sincronização, cobrança, notificações agendadas, terapia ou IA conectada. Desinstalar ou limpar o app pode apagar os registros. O backup automático do Android está desabilitado; configurações de backup do sistema iOS são controladas pelo aparelho.

A conversa guiada usa um roteiro de três interações. A detecção de algumas expressões de risco é apenas uma ajuda limitada por palavras-chave, não uma avaliação clínica. O apoio humano fica acessível em todas as telas principais. Referências: [CVV 188](https://cvv.org.br/) e [SAMU 192](https://www.gov.br/saude/pt-br/composicao/saes/samu-192).

Antes de uma distribuição pública com dados sensíveis, a evolução inclui proteção criptográfica, controle de acesso, revisão clínica do conteúdo, revisão de privacidade e validação em aparelhos físicos iOS e Android.

## Verificar

```sh
npm run check
npx expo-doctor
npm audit
```

`build:mobile` gera os bundles Hermes de iOS e Android. Isso valida empacotamento de JavaScript e assets; não equivale a compilar um APK/IPA. O fluxo de CI executa TypeScript, testes de domínio/persistência, testes de componentes nativos e os dois bundles.

## Estrutura

| Diretório | Responsabilidade |
| --- | --- |
| `app/` | Rotas Expo Router e navegadores nativos |
| `mobile/screens/` | Telas React Native |
| `mobile/components/` | Componentes acessíveis, arte SVG e campos nativos |
| `mobile/repository.ts` | Persistência assíncrona serializada e recuperação |
| `mobile/Store.tsx` | Estado, hidratação, erros e feedback |
| `domain/` | Conteúdo, regras, validação de backups e reflexão guiada |
| `tests/` | Testes de domínio, armazenamento e interações nativas |
| `assets/` | Ícones, splash e licenças das fontes |

As correções transitivas de `uuid` e `decode-uri-component` estão fixadas em `package.json`. O patch de uma linha em `query-string` mantém a interoperabilidade CommonJS/ESM do decodificador corrigido, aplicada em `npm ci`; testes de links cobrem essa compatibilidade. Não remova o patch sem atualizar também o roteador/dependências e executar os testes.
