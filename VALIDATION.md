# Validação do MVP mobile

Esta validação se refere ao aplicativo React Native/Expo, não à antiga implementação web.

## Verificações automatizadas

- TypeScript: aprovado.
- 15 testes de domínio, links e persistência: aprovados.
- 22 testes de componentes e interações React Native: aprovados.
- Expo Doctor: 21/21 verificações aprovadas.
- Auditoria npm: zero vulnerabilidades após atualização das dependências transitivas e aplicação do patch de compatibilidade.
- Exportação de bundles Hermes para Android e iOS: aprovada.
- CI do GitHub aprovado para o código mobile: [execução 36884393614](https://github.com/PDantas84/anima/actions/runs/36884393614).
- Geração dos projetos nativos Android e iOS com `expo prebuild --no-install`: aprovada. Essa etapa não compila os binários nativos.

Os testes cobrem gravações concorrentes, falha de armazenamento sem perda de rascunho, dados corrompidos, restauração validada, hidratação antes de abrir editores, check-in por dia, sequência de jornadas, palavras de risco, backups pelo compartilhamento nativo e exclusão confirmada.

## Execução nativa

Foi preparado um emulador Android 15/API 35, ARM64, 1080×2340, densidade 420. O app foi executado com Expo Go SDK 57 e Metro restrito a localhost/ADB.

Verificados no emulador: onboarding com nome e intenção, navegação inferior, check-in, teclado em campos do diário, alerta de rascunho não salvo, gravação e leitura de uma página, início e conclusão de encontro de jornada, temporizador de um minuto até zero e registro do ritual, envio de conversa com teclado aberto, salvamento da reflexão, importação real pelo seletor do Android e persistência após encerramento e reabertura.

A importação no Android lê o URI autorizado pelo seletor, preservando o arquivo original. Isso também evita uma falha do diretório de cache do DocumentPicker no Expo Go SDK 57, encontrada na execução real. O teclado encobria o compositor da conversa; a correção foi verificada no emulador.

O compartilhamento nativo foi acionado. A imagem AOSP usada no emulador não contém um aplicativo destinatário de arquivos JSON; portanto, a entrega de um backup para outro aplicativo não foi validada ponta a ponta. O conteúdo JSON e a integração de compartilhamento são cobertos pelos testes de componentes.

Os registros usados na verificação são exemplos criados no emulador. O aplicativo distribuído inicia vazio.

## Limites da validação

Não foi executado em iPhone ou aparelho Android físico. Não há teste de sensação tátil real, VoiceOver/TalkBack completo ou publicação em lojas. A exportação de JavaScript para iOS e a geração do projeto Xcode não equivalem a compilar ou testar um IPA.

## APK Android

Compilação local de produção pelo EAS concluída com sucesso: 605 tarefas Gradle, 6 minutos e 24 segundos. APK assinado com as credenciais do projeto Expo; assinatura v2 verificada com `apksigner`.

- Pacote: `com.pdantas84.anima`, versão `0.2.0`, versionCode `1`.
- Android mínimo: API 24; alvo: API 36.
- Arquiteturas incluídas: ARM64, ARMv7, x86 e x86_64.
- APK universal: aproximadamente 101 MiB.
- SHA-256: `b0a3199caf7610d56fe23f98da84b1c93a1ba8c78bd6e2e1b807a71971647799`.
- Código aplicativo: commit `29e0af7` (os commits posteriores documentam a entrega e suas capturas).

O APK foi instalado no emulador Android 15 e aberto com Wi-Fi e dados móveis desligados, sem Expo Go. Foram verificados onboarding, check-in, criação de diário, envio com teclado aberto, salvamento da reflexão, encerramento/reabertura com os dois registros preservados e restauração pelo seletor de arquivos. O arquivo original do backup permaneceu intacto. O buffer de falhas do Android ficou vazio durante essa verificação.

O aplicativo inicia sem registros pré-carregados. As capturas em `docs/android-*.png` foram obtidas diretamente do APK instalado, usando exemplos sintéticos. Nenhum dado de teste é embarcado no instalador.
