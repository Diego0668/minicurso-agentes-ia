import { describe, expect, it } from 'vitest'
import { filtrarSalas, listarBlocos } from './salas'
import type { Sala } from './tipos'

function sala(parcial: Partial<Sala> & Pick<Sala, 'id'>): Sala {
  return {
    nome: `Sala ${parcial.id}`,
    bloco: 'Instituto de Computação',
    andar: 'Térreo',
    tipo: 'sala-de-aula',
    capacidade: 40,
    recursos: [],
    descricao: '',
    ...parcial,
  }
}

const salas: Sala[] = [
  sala({ id: 'a', nome: 'Laboratório de Redes', capacidade: 25, recursos: ['computadores', 'projetor'] }),
  sala({ id: 'b', nome: 'Auditório', bloco: 'FAET', capacidade: 120, recursos: ['projetor', 'videoconferencia'] }),
  sala({ id: 'c', nome: 'Sala 101', capacidade: 40, recursos: ['ar-condicionado'] }),
]

describe('filtrarSalas', () => {
  it('sem filtros devolve todas as salas', () => {
    expect(filtrarSalas(salas, {})).toHaveLength(3)
  })

  it('exige todos os recursos selecionados', () => {
    const resultado = filtrarSalas(salas, { recursos: ['projetor', 'computadores'] })
    expect(resultado.map((s) => s.id)).toEqual(['a'])
  })

  it('respeita a capacidade mínima (inclusive)', () => {
    const resultado = filtrarSalas(salas, { capacidadeMinima: 40 })
    expect(resultado.map((s) => s.id).sort()).toEqual(['b', 'c'])
  })

  it('busca ignora acentos e maiúsculas', () => {
    expect(filtrarSalas(salas, { busca: 'LABORATORIO' }).map((s) => s.id)).toEqual(['a'])
  })

  it('filtra por bloco', () => {
    expect(filtrarSalas(salas, { bloco: 'FAET' }).map((s) => s.id)).toEqual(['b'])
  })
})

describe('listarBlocos', () => {
  it('lista blocos sem repetição, em ordem alfabética', () => {
    expect(listarBlocos(salas)).toEqual(['FAET', 'Instituto de Computação'])
  })
})
