import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { serve } from '@hono/node-server'
import { criarApp } from './app'
import { abrirBanco } from './db'

const PORTA = Number(process.env.PORT ?? 3001)
const ARQUIVO_BANCO = path.resolve(import.meta.dirname, '..', 'dados', 'reservas.db')

mkdirSync(path.dirname(ARQUIVO_BANCO), { recursive: true })
const app = criarApp({ db: abrirBanco(ARQUIVO_BANCO) })

serve({ fetch: app.fetch, port: PORTA }, ({ port }) => {
  console.log(`API de reservas em http://localhost:${port}/api (banco: dados/reservas.db)`)
})
