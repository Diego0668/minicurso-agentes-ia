# AGENTS.md

## Comandos essenciais

```sh
npm run dev          # frontend (Vite :5173) + API (Hono :3001) com hot-reload
npm test             # testes unitários e da API (Vitest)
npm run test:aceitacao  # testes de aceitação (pasta tests/aceitacao/)
npm run lint         # ESLint
npm run build        # typecheck (tsc -b) + build de produção
npm run db:reset     # apaga dados/reservas.db e recria com dados de demonstração
```

## Arquitetura

- **Frontend**: React 19 + Vite + Tailwind CSS 4 + shadcn/ui (em `src/`)
- **API**: Hono (em `server/`) — roda na porta 3001
- **Banco**: SQLite via `node:sqlite` (embutido no Node, sem dependência externa)
- **Banco local**: `dados/reservas.db` (criado automaticamente, fora do Git)
- **Proxy**: Vite redireciona `/api` → `http://localhost:3001`

## Convenções

- Alias `@` → `src/` (configurado no Vite e tsconfig)
- Sem login: o usuário de demonstração é escolhido no canto superior direito do frontend
- `src/domain/` contém regras de negócio puras (sem React, sem banco) — testes de aceitação importam apenas estes módulos
- Tipos compartilhados entre frontend e API estão em `src/domain/tipos.ts`

## Testes

- Testes de aceitação (`tests/aceitacao/`) importam apenas nomes específicos de `src/domain/` — manter as assinaturas em `docs/api-dominio.md`
- Para rodar um único teste: `npx vitest run <arquivo>`

## Gotchas

- Se a porta 3001 ou 5173 estiver em uso, feche o outro terminal que está rodando o app
- Se os dados da agenda estiverem estranhos, rode `npm run db:reset`
- Node >= 22.13.0 obrigatório
