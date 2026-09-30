import type { Reserva } from './tipos'

export interface NovaReserva {
  salaId: string
  usuarioId: string
  inicio: string // ISO 8601
  fim: string // ISO 8601
  motivo: string
}

export type CodigoRejeicao = 'HORARIO_INVALIDO' | 'NO_PASSADO' | 'CONFLITO'

export type ResultadoValidacao =
  | { ok: true }
  | { ok: false; codigo: CodigoRejeicao; mensagem: string; conflitante?: Reserva }

export interface Intervalo {
  inicio: string
  fim: string
}

/**
 * Decide se `nova` pode ser criada. `existentes` pode conter reservas de qualquer sala e status.
 */
export function validarReserva(nova: NovaReserva, existentes: Reserva[], agora: Date): ResultadoValidacao {
  const inicio = new Date(nova.inicio)
  const fim = new Date(nova.fim)

  // Verifica se as datas são válidas
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    return { ok: false, codigo: 'HORARIO_INVALIDO', mensagem: 'Data ou horário inválido.' }
  }

  // Verifica se o fim é depois do início
  if (fim <= inicio) {
    return { ok: false, codigo: 'HORARIO_INVALIDO', mensagem: 'O horário de fim deve ser depois do início.' }
  }

  // Verifica se a reserva não está no passado
  if (fim <= agora) {
    return { ok: false, codigo: 'NO_PASSADO', mensagem: 'Não é possível reservar em horários passados.' }
  }

  // Verifica se a reserva não é em um dia anterior ao dia atual
  const inicioHoje = new Date(agora)
  inicioHoje.setHours(0, 0, 0, 0)
  if (inicio < inicioHoje) {
    return { ok: false, codigo: 'NO_PASSADO', mensagem: 'Não é possível reservar em dias anteriores ao dia atual.' }
  }

  // Verifica conflito com reservas existentes
  const conflitante = existentes.find(
    (r) => r.salaId === nova.salaId && r.status === 'ativa' && inicio < new Date(r.fim) && fim > new Date(r.inicio),
  )

  if (conflitante) {
    return {
      ok: false,
      codigo: 'CONFLITO',
      mensagem: 'A sala já está reservada neste horário.',
      conflitante,
    }
  }

  return { ok: true }
}

/**
 * Verifica se a sala está disponível no intervalo especificado.
 */
export function salaDisponivel(reservas: Reserva[], salaId: string, intervalo: Intervalo): boolean {
  const inicio = new Date(intervalo.inicio)
  const fim = new Date(intervalo.fim)

  return !reservas.some(
    (r) => r.salaId === salaId && r.status === 'ativa' && inicio < new Date(r.fim) && fim > new Date(r.inicio),
  )
}

/**
 * Retorna os horários livres da sala dentro da janela especificada.
 */
export function horariosLivres(reservas: Reserva[], salaId: string, janela: Intervalo): Intervalo[] {
  const inicioJanela = new Date(janela.inicio)
  const fimJanela = new Date(janela.fim)

  const reservasDaSala = reservas
    .filter((r) => r.salaId === salaId && r.status === 'ativa')
    .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())

  const livres: Intervalo[] = []
  let atual = inicioJanela

  for (const reserva of reservasDaSala) {
    const inicioReserva = new Date(reserva.inicio)
    const fimReserva = new Date(reserva.fim)

    if (inicioReserva > atual) {
      livres.push({ inicio: atual.toISOString(), fim: inicioReserva.toISOString() })
    }
    if (fimReserva > atual) {
      atual = fimReserva
    }
  }

  if (atual < fimJanela) {
    livres.push({ inicio: atual.toISOString(), fim: fimJanela.toISOString() })
  }

  return livres
}
