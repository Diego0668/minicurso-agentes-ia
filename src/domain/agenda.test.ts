import { describe, expect, it } from 'vitest'
import { diasDaSemana, inicioDaSemana, posicionarNaGrade } from './agenda'
import type { Reserva } from './tipos'

function reserva(inicio: Date, fim: Date): Reserva {
  return {
    id: 'r1',
    salaId: 's1',
    usuarioId: 'u1',
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
    motivo: 'Aula',
    status: 'ativa',
    criadaEm: inicio.toISOString(),
  }
}

describe('inicioDaSemana', () => {
  it('uma quarta-feira pertence à semana que começa na segunda anterior', () => {
    const quarta = new Date(2026, 8, 30, 15, 30) // 30/09/2026
    expect(inicioDaSemana(quarta)).toEqual(new Date(2026, 8, 28, 0, 0))
  })

  it('domingo pertence à semana que começou seis dias antes', () => {
    const domingo = new Date(2026, 9, 4, 10) // 04/10/2026
    expect(inicioDaSemana(domingo)).toEqual(new Date(2026, 8, 28, 0, 0))
  })
})

describe('diasDaSemana', () => {
  it('gera segunda a sábado por padrão', () => {
    const dias = diasDaSemana(new Date(2026, 8, 28))
    expect(dias).toHaveLength(6)
    expect(dias[5]).toEqual(new Date(2026, 9, 3))
  })
})

describe('posicionarNaGrade', () => {
  const dia = new Date(2026, 8, 30)

  it('calcula topo e altura proporcionais ao horário de funcionamento (7h–22h)', () => {
    const [bloco] = posicionarNaGrade([reserva(new Date(2026, 8, 30, 8), new Date(2026, 8, 30, 11))], dia)
    expect(bloco.topo).toBeCloseTo((1 / 15) * 100)
    expect(bloco.altura).toBeCloseTo((3 / 15) * 100)
  })

  it('ignora reservas de outros dias', () => {
    expect(posicionarNaGrade([reserva(new Date(2026, 9, 1, 8), new Date(2026, 9, 1, 9))], dia)).toEqual([])
  })
})
