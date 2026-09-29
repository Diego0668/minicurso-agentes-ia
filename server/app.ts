import { Hono } from 'hono'
import { abrirBanco, type Banco } from './db'
import * as repo from './repositorio'

export interface OpcoesApp {
  /** Banco já aberto. Se omitido, abre um banco em memória com os dados de demonstração. */
  db?: Banco
}

/** Cria a API. Os testes usam `criarApp()` + `app.request(...)`, sem subir servidor HTTP. */
export function criarApp({ db = abrirBanco(':memory:') }: OpcoesApp = {}) {
  const app = new Hono().basePath('/api')

  app.get('/saude', (c) => c.json({ ok: true }))

  app.get('/usuarios', (c) => c.json(repo.listarUsuarios(db)))

  app.get('/salas', (c) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(hoje.getDate() + 1)
    const reservasHoje = repo.contarReservasPorSala(db, hoje.toISOString(), amanha.toISOString())
    return c.json(repo.listarSalas(db).map((sala) => ({ ...sala, reservasHoje: reservasHoje[sala.id] ?? 0 })))
  })

  app.get('/salas/:id', (c) => {
    const sala = repo.buscarSala(db, c.req.param('id'))
    if (!sala) return c.json({ erro: 'Sala não encontrada.' }, 404)
    return c.json(sala)
  })

  // Reservas ativas da sala no intervalo [de, ate). Ex.: ?de=2026-09-28T04:00:00.000Z&ate=2026-10-04T04:00:00.000Z
  app.get('/salas/:id/reservas', (c) => {
    const sala = repo.buscarSala(db, c.req.param('id'))
    if (!sala) return c.json({ erro: 'Sala não encontrada.' }, 404)
    const de = c.req.query('de')
    const ate = c.req.query('ate')
    if (!de || !ate || Number.isNaN(Date.parse(de)) || Number.isNaN(Date.parse(ate))) {
      return c.json({ erro: 'Informe os parâmetros "de" e "ate" em ISO 8601.' }, 400)
    }
    const deIso = new Date(de).toISOString()
    const ateIso = new Date(ate).toISOString()
    return c.json(repo.listarReservasDaSala(db, sala.id, deIso, ateIso))
  })

  app.notFound((c) => c.json({ erro: 'Rota não encontrada.' }, 404))
  app.onError((erro, c) => {
    console.error(erro)
    return c.json({ erro: 'Erro interno no servidor.' }, 500)
  })

  return app
}
