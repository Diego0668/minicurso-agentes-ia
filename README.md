# Reserva de Salas · UFMT

Sistema de reserva de laboratórios, salas de aula e auditórios do campus Cuiabá da UFMT.

## Pré-requisitos

- **Node.js 22.13 ou mais novo** (`node -v`). Não precisa instalar banco de dados: usamos o SQLite que já
  vem embutido no Node.
- Git e VS Code.

## Como rodar

```sh
npm install
npm run dev
```

O navegador abre em <http://localhost:5173>. A API sobe junto em <http://localhost:3001/api>.

| Comando | O que faz |
|---|---|
| `npm run dev` | front-end (Vite) + API (Hono) com recarga automática |
| `npm test` | testes unitários e da API (Vitest) |
| `npm run test:aceitacao` | testes de aceitação (pasta `tests/aceitacao/`, quando existir) |
| `npm run lint` | ESLint |
| `npm run build` | checagem de tipos + build de produção |
| `npm run db:reset` | apaga o banco local; ele é recriado com os dados de demonstração |

## Estrutura

```
src/
  domain/      regras de negócio puras (sem React, sem banco) + testes
  components/  componentes de interface (ui/ = shadcn/ui)
  pages/       telas
  lib/         cliente da API, tema, usuário atual, rotas
server/        API (Hono) e acesso ao banco (node:sqlite)
dados/         banco SQLite local (criado ao rodar; fora do Git)
```

Não há login: escolha o usuário de demonstração no canto superior direito.

## Travou?

- `npm run dev` diz que a porta está em uso → feche o outro terminal que está rodando o app.
- Dados estranhos na agenda → `npm run db:reset` e rode de novo.
