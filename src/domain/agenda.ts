import type { Reserva } from './tipos'

/** Horário de funcionamento exibido na agenda (hora local). */
export const HORA_ABERTURA = 7
export const HORA_FECHAMENTO = 22

/** Segunda-feira 00:00 (hora local) da semana que contém `data`. */
export function inicioDaSemana(data: Date): Date {
  const resultado = new Date(data)
  resultado.setHours(0, 0, 0, 0)
  const diaDaSemana = resultado.getDay() // 0 = domingo
  const deslocamento = diaDaSemana === 0 ? -6 : 1 - diaDaSemana
  resultado.setDate(resultado.getDate() + deslocamento)
  return resultado
}

/** Os `quantidade` dias a partir de `inicio` (padrão: segunda a sábado). */
export function diasDaSemana(inicio: Date, quantidade = 6): Date[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const dia = new Date(inicio)
    dia.setDate(inicio.getDate() + i)
    return dia
  })
}

export function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

export interface BlocoNaGrade {
  reserva: Reserva
  /** Posição do topo, em % da altura do dia (0 = abertura). */
  topo: number
  /** Altura, em % da altura do dia. */
  altura: number
}

/**
 * Converte as reservas de um dia em blocos posicionados na grade da agenda.
 * O que estiver fora do horário de funcionamento é recortado.
 */
export function posicionarNaGrade(reservas: Reserva[], dia: Date): BlocoNaGrade[] {
  const abertura = new Date(dia)
  abertura.setHours(HORA_ABERTURA, 0, 0, 0)
  const fechamento = new Date(dia)
  fechamento.setHours(HORA_FECHAMENTO, 0, 0, 0)
  const total = fechamento.getTime() - abertura.getTime()

  return reservas
    .map((reserva) => {
      const inicio = Math.max(new Date(reserva.inicio).getTime(), abertura.getTime())
      const fim = Math.min(new Date(reserva.fim).getTime(), fechamento.getTime())
      return { reserva, inicio, fim }
    })
    .filter(({ inicio, fim }) => fim > inicio)
    .sort((a, b) => a.inicio - b.inicio)
    .map(({ reserva, inicio, fim }) => ({
      reserva,
      topo: ((inicio - abertura.getTime()) / total) * 100,
      altura: ((fim - inicio) / total) * 100,
    }))
}
