import type { Recurso, Sala, TipoSala } from './tipos'

export const NOMES_RECURSOS: Record<Recurso, string> = {
  projetor: 'Projetor',
  computadores: 'Computadores',
  'ar-condicionado': 'Ar-condicionado',
  'quadro-digital': 'Quadro digital',
  videoconferencia: 'Videoconferência',
  acessibilidade: 'Acessibilidade',
}

export const NOMES_TIPOS: Record<TipoSala, string> = {
  laboratorio: 'Laboratório',
  'sala-de-aula': 'Sala de aula',
  auditorio: 'Auditório',
  reuniao: 'Sala de reunião',
}

export interface FiltroSalas {
  /** Texto livre: procura no nome, no bloco e na descrição (sem diferenciar acentos/maiúsculas). */
  busca?: string
  /** A sala precisa ter TODOS os recursos listados. */
  recursos?: Recurso[]
  capacidadeMinima?: number
  bloco?: string
}

export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function filtrarSalas<S extends Sala>(salas: S[], filtro: FiltroSalas): S[] {
  const busca = normalizarTexto(filtro.busca ?? '')
  const recursos = filtro.recursos ?? []
  const capacidadeMinima = filtro.capacidadeMinima ?? 0

  return salas
    .filter((sala) => {
      if (busca) {
        const alvo = normalizarTexto(`${sala.nome} ${sala.bloco} ${sala.descricao}`)
        if (!alvo.includes(busca)) return false
      }
      if (filtro.bloco && sala.bloco !== filtro.bloco) return false
      if (sala.capacidade < capacidadeMinima) return false
      return recursos.every((recurso) => sala.recursos.includes(recurso))
    })
    .sort((a, b) => a.bloco.localeCompare(b.bloco, 'pt-BR') || a.nome.localeCompare(b.nome, 'pt-BR'))
}

export function filtroVazio(filtro: FiltroSalas): boolean {
  return !filtro.busca && !filtro.bloco && !filtro.capacidadeMinima && !filtro.recursos?.length
}

export function listarBlocos(salas: Sala[]): string[] {
  return [...new Set(salas.map((sala) => sala.bloco))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
