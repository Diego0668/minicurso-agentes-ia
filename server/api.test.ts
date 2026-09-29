import { describe, expect, it } from 'vitest'
import type { Sala } from '../src/domain/tipos'
import { criarApp } from './app'

describe('API — consultas', () => {
  const app = criarApp()

  it('GET /api/salas lista as salas de demonstração', async () => {
    const resposta = await app.request('/api/salas')
    expect(resposta.status).toBe(200)
    const salas = (await resposta.json()) as Sala[]
    expect(salas.length).toBeGreaterThan(5)
    expect(salas[0]).toHaveProperty('capacidade')
  })

  it('GET /api/salas/:id devolve 404 com mensagem para sala inexistente', async () => {
    const resposta = await app.request('/api/salas/nao-existe')
    expect(resposta.status).toBe(404)
    expect(await resposta.json()).toEqual({ erro: 'Sala não encontrada.' })
  })

  it('GET /api/salas/:id/reservas exige o intervalo', async () => {
    const resposta = await app.request('/api/salas/ic-lab-01/reservas')
    expect(resposta.status).toBe(400)
  })
})
