# Validação do MVP web

Validação local em 1 de outubro de 2026, usando Node.js 24.17, Expo SDK 54 e Google Chrome com Playwright.

| Verificação                                  | Resultado                                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| TypeScript (`npm run typecheck`)             | Sem erros                                                                                                 |
| Regras de domínio (`npm test`)               | 7 testes passaram                                                                                         |
| Exportação de produção (`npm run build:web`) | Concluída                                                                                                 |
| Fluxos de uso (`npm run test:e2e`)           | 22 testes: 11 cenários em desktop e celular                                                               |
| Layout                                       | 9 telas em 1440, 820 e 390 px; sem overflow horizontal                                                    |
| Acessibilidade automática                    | Nenhuma violação detectada pelo axe-core, regras WCAG 2 A/AA e 2.1 AA, nas 27 combinações de tela/largura |
| Rede no primeiro acesso                      | Nenhuma requisição externa à origem da aplicação                                                          |

Os cenários incluem persistência após recarga, atualização do check-in, criação/edição/busca/exclusão no diário, proteção de rascunhos, progresso e bloqueio de avanço indevido nos ciclos, cronômetro, favoritos, encaminhamento para apoio, exportação/restauração, armazenamento corrompido, falha de gravação e navegação por teclado.

A revisão visual verificou os layouts de desktop e celular, além de capturas do aplicativo em uso. Emulação móvel no Chrome não equivale à validação em Safari/iPhone físico. iOS e Android nativos não foram testados. A análise automática de acessibilidade não substitui testes com tecnologias assistivas.

## Limitações conhecidas

- Persistência local, sem autenticação, criptografia ou sincronização entre dispositivos.
- A conversa usa roteiros explícitos; não há provedor de IA generativa conectado.
- Regras de segurança por palavras-chave são limitadas e não avaliam risco clínico.
- A auditoria npm conserva quatro avisos herdados da cadeia do SDK: um alto de compilação em `image-size` e três moderados em `decode-uri-component` / `query-string` / Expo Router. Contexto e próximos passos estão no README.
- O app web foi validado no modo de produção servido em `127.0.0.1:4173`. A prévia é local; não houve publicação pública do aplicativo.
