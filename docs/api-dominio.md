# API pública do domínio (`src/domain/`)

Os testes de aceitação (`tests/aceitacao/`) importam **apenas** estes nomes. Quem implementa pode organizar o
resto como quiser, mas precisa manter estas assinaturas — a especificação dos alunos deve fixá-las.

## Tipos (`src/domain/tipos.ts`)

```ts
type StatusReserva = 'ativa' | 'cancelada'

interface Reserva {
  id: string
  salaId: string
  usuarioId: string
  inicio: string // ISO 8601
  fim: string // ISO 8601
  motivo: string
  status: StatusReserva
  criadaEm: string // ISO 8601
}
```

## Funcionalidade 1 — criar reserva (`src/domain/reservas.ts`)

```ts
interface NovaReserva {
  salaId: string
  usuarioId: string
  inicio: string // ISO 8601
  fim: string // ISO 8601
  motivo: string
}

type CodigoRejeicao = 'HORARIO_INVALIDO' | 'NO_PASSADO' | 'CONFLITO'

type ResultadoValidacao =
  | { ok: true }
  | { ok: false; codigo: CodigoRejeicao; mensagem: string; conflitante?: Reserva }

/** Decide se `nova` pode ser criada. `existentes` pode conter reservas de qualquer sala e status. */
function validarReserva(nova: NovaReserva, existentes: Reserva[], agora: Date): ResultadoValidacao
```

- `mensagem` é o texto exibido ao usuário (não vazio). Os testes verificam `ok` e `codigo`, não o texto exato.
- Com `codigo: 'CONFLITO'`, `conflitante` é a reserva existente que bloqueou.

## Funcionalidade 2 — minhas reservas e disponibilidade (`src/domain/minhas-reservas.ts`)

```ts
interface MinhasReservas<R extends Reserva = Reserva> {
  proximas: R[] // ativas com fim > agora, início crescente
  anteriores: R[] // ativas com fim <= agora, início decrescente
  canceladas: R[] // status 'cancelada', início decrescente
}
function separarMinhasReservas<R extends Reserva>(reservas: R[], usuarioId: string, agora: Date): MinhasReservas<R>

type CodigoRecusaCancelamento = 'NAO_E_DONO' | 'JA_CANCELADA' | 'JA_INICIADA'
type ResultadoCancelamento = { ok: true } | { ok: false; codigo: CodigoRecusaCancelamento; mensagem: string }
function podeCancelar(reserva: Reserva, usuarioId: string, agora: Date): ResultadoCancelamento

interface Intervalo { inicio: string; fim: string } // ISO 8601 (exportado por reservas.ts)
function salaDisponivel(reservas: Reserva[], salaId: string, intervalo: Intervalo): boolean
/** Lacunas livres, em ordem; datas devolvidas em ISO 8601 UTC (toISOString). */
function horariosLivres(reservas: Reserva[], salaId: string, janela: Intervalo): Intervalo[]
```
