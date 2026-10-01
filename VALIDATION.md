# Validação do MVP mobile

Esta validação se refere ao aplicativo React Native/Expo, não à antiga implementação web.

## Verificações automatizadas

- TypeScript: aprovado.
- 15 testes de domínio, links e persistência: aprovados.
- 20 testes de componentes e interações React Native: aprovados.
- Expo Doctor: 21/21 verificações aprovadas.
- Auditoria npm: zero vulnerabilidades após atualização das dependências transitivas e aplicação do patch de compatibilidade.
- Exportação de bundles Hermes para Android e iOS: aprovada.
- Geração dos projetos nativos Android e iOS com `expo prebuild --no-install`: aprovada. Essa etapa não compila os binários nativos.

Os testes cobrem gravações concorrentes, falha de armazenamento sem perda de rascunho, dados corrompidos, restauração validada, hidratação antes de abrir editores, check-in por dia, sequência de jornadas, palavras de risco, backups pelo compartilhamento nativo e exclusão confirmada.

## Execução nativa

Foi preparado um emulador Android 15/API 35, ARM64, 1080×2340, densidade 420. O app foi executado com Expo Go SDK 57 e Metro restrito a localhost/ADB.

Verificados no emulador: onboarding com nome e intenção, navegação inferior, check-in, teclado em campos do diário, alerta de rascunho não salvo, gravação e leitura de uma página, início e conclusão de encontro de jornada, temporizador de um minuto até zero e registro do ritual.

Os registros usados na verificação são exemplos criados no emulador. O aplicativo distribuído inicia vazio.

## Limites da validação

Não foi executado em iPhone ou aparelho Android físico. Não há teste de sensação tátil real, VoiceOver/TalkBack completo ou publicação em lojas. A exportação de JavaScript para iOS e a geração do projeto Xcode não equivalem a compilar ou testar um IPA.

A fila remota de Android no Expo atrasou a geração do APK. A compilação local pelo EAS, com as credenciais de assinatura do mesmo projeto, está sendo preparada; o resultado final do binário será registrado aqui depois da compilação e da instalação no emulador.
