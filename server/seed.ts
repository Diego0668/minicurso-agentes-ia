import type { Reserva, Sala, Usuario } from '../src/domain/tipos'
import { inicioDaSemana } from '../src/domain/agenda'

// Dados de demonstração inspirados no campus Cuiabá da UFMT (nomes de pessoas são fictícios).

export const SALAS: Sala[] = [
  {
    id: 'ic-lab-01',
    nome: 'Laboratório de Computação 1',
    bloco: 'Instituto de Computação (IC)',
    andar: 'Térreo',
    tipo: 'laboratorio',
    capacidade: 40,
    recursos: ['computadores', 'projetor', 'ar-condicionado', 'acessibilidade'],
    descricao: '40 estações Linux/Windows. Usado nas disciplinas introdutórias de programação.',
  },
  {
    id: 'ic-lab-02',
    nome: 'Laboratório de Computação 2',
    bloco: 'Instituto de Computação (IC)',
    andar: 'Térreo',
    tipo: 'laboratorio',
    capacidade: 30,
    recursos: ['computadores', 'projetor', 'ar-condicionado'],
    descricao: 'Máquinas com GPU para disciplinas de computação gráfica e aprendizado de máquina.',
  },
  {
    id: 'ic-lab-redes',
    nome: 'Laboratório de Redes',
    bloco: 'Instituto de Computação (IC)',
    andar: '1º andar',
    tipo: 'laboratorio',
    capacidade: 24,
    recursos: ['computadores', 'ar-condicionado', 'quadro-digital'],
    descricao: 'Bancadas com switches, roteadores e racks para aulas práticas de redes.',
  },
  {
    id: 'ic-lab-es',
    nome: 'Laboratório de Engenharia de Software',
    bloco: 'Instituto de Computação (IC)',
    andar: '1º andar',
    tipo: 'laboratorio',
    capacidade: 20,
    recursos: ['computadores', 'projetor', 'ar-condicionado', 'videoconferencia'],
    descricao: 'Mesas em ilhas para trabalho em equipe, telão e câmera para reuniões remotas.',
  },
  {
    id: 'ic-sala-reunioes',
    nome: 'Sala de Reuniões do IC',
    bloco: 'Instituto de Computação (IC)',
    andar: '1º andar',
    tipo: 'reuniao',
    capacidade: 12,
    recursos: ['videoconferencia', 'ar-condicionado', 'quadro-digital'],
    descricao: 'Mesa oval, TV 65" e sistema de áudio para bancas e reuniões de colegiado.',
  },
  {
    id: 'ic-auditorio',
    nome: 'Auditório do IC',
    bloco: 'Instituto de Computação (IC)',
    andar: 'Térreo',
    tipo: 'auditorio',
    capacidade: 90,
    recursos: ['projetor', 'ar-condicionado', 'videoconferencia', 'acessibilidade'],
    descricao: 'Palco com púlpito, microfones sem fio e transmissão ao vivo. Recebe os eventos do instituto.',
  },
  {
    id: 'faet-sala-203',
    nome: 'Sala 203',
    bloco: 'Faculdade de Arquitetura, Engenharia e Tecnologia (FAET)',
    andar: '2º andar',
    tipo: 'sala-de-aula',
    capacidade: 50,
    recursos: ['projetor', 'ar-condicionado'],
    descricao: 'Sala de aula com carteiras universitárias e quadro branco duplo.',
  },
  {
    id: 'faet-lab-eletronica',
    nome: 'Laboratório de Eletrônica',
    bloco: 'Faculdade de Arquitetura, Engenharia e Tecnologia (FAET)',
    andar: 'Térreo',
    tipo: 'laboratorio',
    capacidade: 18,
    recursos: ['computadores', 'ar-condicionado'],
    descricao: 'Bancadas com osciloscópios, fontes e kits de microcontroladores.',
  },
  {
    id: 'faet-lab-robotica',
    nome: 'Laboratório de Robótica',
    bloco: 'Faculdade de Arquitetura, Engenharia e Tecnologia (FAET)',
    andar: '1º andar',
    tipo: 'laboratorio',
    capacidade: 16,
    recursos: ['computadores', 'projetor', 'acessibilidade'],
    descricao: 'Espaço da equipe de robótica: impressoras 3D, arena de testes e ferramentas.',
  },
  {
    id: 'if-sala-12',
    nome: 'Sala 12',
    bloco: 'Instituto de Física (IF)',
    andar: 'Térreo',
    tipo: 'sala-de-aula',
    capacidade: 60,
    recursos: ['projetor', 'acessibilidade'],
    descricao: 'Sala ampla usada por turmas de Física Geral e Cálculo.',
  },
  {
    id: 'bc-sala-estudos',
    nome: 'Sala de Estudos em Grupo 3',
    bloco: 'Biblioteca Central',
    andar: '2º andar',
    tipo: 'reuniao',
    capacidade: 8,
    recursos: ['ar-condicionado', 'quadro-digital', 'acessibilidade'],
    descricao: 'Sala silenciosa com lousa digital, reservável por grupos de estudo.',
  },
  {
    id: 'cct-teatro',
    nome: 'Teatro Universitário',
    bloco: 'Centro Cultural',
    andar: 'Térreo',
    tipo: 'auditorio',
    capacidade: 300,
    recursos: ['projetor', 'ar-condicionado', 'videoconferencia', 'acessibilidade'],
    descricao: 'Grande auditório para aulas inaugurais, formaturas e eventos de extensão.',
  },
]

export const USUARIOS: Usuario[] = [
  { id: 'ana', nome: 'Profa. Ana Beatriz Rondon', papel: 'docente', unidade: 'Instituto de Computação' },
  { id: 'carlos', nome: 'Prof. Carlos Arruda', papel: 'docente', unidade: 'FAET' },
  { id: 'mariana', nome: 'Mariana Campos', papel: 'discente', unidade: 'Ciência da Computação' },
  { id: 'joao', nome: 'João Pedro Nunes', papel: 'discente', unidade: 'Engenharia de Computação' },
  { id: 'luiza', nome: 'Luíza Figueiredo', papel: 'tecnico', unidade: 'Secretaria do IC' },
]

interface ReservaModelo {
  salaId: string
  usuarioId: string
  /** 0 = segunda-feira da semana atual; valores negativos ou maiores que 6 alcançam outras semanas. */
  dia: number
  inicio: string
  fim: string
  motivo: string
  status?: Reserva['status']
}

const MODELOS: ReservaModelo[] = [
  // Aulas recorrentes (semana atual e seguinte)
  ...[0, 2, 7, 9].flatMap((dia): ReservaModelo[] => [
    { salaId: 'ic-lab-01', usuarioId: 'ana', dia, inicio: '07:30', fim: '09:30', motivo: 'Algoritmos e Programação I — turma A' },
    { salaId: 'ic-lab-01', usuarioId: 'ana', dia, inicio: '13:30', fim: '15:30', motivo: 'Estruturas de Dados — prática' },
    { salaId: 'faet-sala-203', usuarioId: 'carlos', dia, inicio: '08:00', fim: '10:00', motivo: 'Circuitos Elétricos I' },
  ]),
  ...[1, 3, 8, 10].flatMap((dia): ReservaModelo[] => [
    { salaId: 'ic-lab-redes', usuarioId: 'ana', dia, inicio: '09:40', fim: '11:40', motivo: 'Redes de Computadores — laboratório' },
    { salaId: 'faet-lab-eletronica', usuarioId: 'carlos', dia, inicio: '14:00', fim: '17:00', motivo: 'Sistemas Digitais — bancada' },
    { salaId: 'if-sala-12', usuarioId: 'carlos', dia, inicio: '19:00', fim: '21:00', motivo: 'Cálculo II — turma noturna' },
  ]),
  // Eventos pontuais
  { salaId: 'ic-auditorio', usuarioId: 'luiza', dia: 2, inicio: '08:00', fim: '12:00', motivo: 'Semana acadêmica — palestras' },
  { salaId: 'ic-auditorio', usuarioId: 'luiza', dia: 3, inicio: '08:00', fim: '12:00', motivo: 'Semana acadêmica — palestras' },
  { salaId: 'ic-auditorio', usuarioId: 'luiza', dia: 4, inicio: '14:00', fim: '17:00', motivo: 'Palestra: carreira em tecnologia' },
  { salaId: 'ic-sala-reunioes', usuarioId: 'ana', dia: 1, inicio: '14:00', fim: '15:30', motivo: 'Reunião do colegiado de curso' },
  { salaId: 'ic-sala-reunioes', usuarioId: 'mariana', dia: 4, inicio: '10:00', fim: '11:30', motivo: 'Defesa de TCC — Mariana Campos' },
  { salaId: 'ic-lab-es', usuarioId: 'joao', dia: 0, inicio: '16:00', fim: '18:00', motivo: 'Grupo de pesquisa em Engenharia de Software' },
  { salaId: 'ic-lab-es', usuarioId: 'ana', dia: 3, inicio: '13:30', fim: '17:30', motivo: 'Oficina de testes automatizados' },
  { salaId: 'ic-lab-02', usuarioId: 'mariana', dia: 2, inicio: '18:00', fim: '20:00', motivo: 'Monitoria de Computação Gráfica' },
  { salaId: 'faet-lab-robotica', usuarioId: 'joao', dia: 5, inicio: '08:00', fim: '12:00', motivo: 'Treino da equipe de robótica' },
  { salaId: 'bc-sala-estudos', usuarioId: 'mariana', dia: 1, inicio: '16:00', fim: '18:00', motivo: 'Estudo em grupo — Cálculo II' },
  { salaId: 'bc-sala-estudos', usuarioId: 'joao', dia: 3, inicio: '10:00', fim: '12:00', motivo: 'Preparação para a maratona de programação' },
  { salaId: 'cct-teatro', usuarioId: 'luiza', dia: 11, inicio: '19:00', fim: '22:00', motivo: 'Aula inaugural do semestre' },
  // Reserva cancelada (aparece no banco, mas não na agenda)
  { salaId: 'ic-lab-02', usuarioId: 'joao', dia: 1, inicio: '08:00', fim: '10:00', motivo: 'Hackathon interno (adiado)', status: 'cancelada' },
  // Semana passada
  { salaId: 'ic-lab-es', usuarioId: 'joao', dia: -4, inicio: '16:00', fim: '18:00', motivo: 'Grupo de pesquisa em Engenharia de Software' },
]

function horario(segunda: Date, dia: number, hhmm: string): Date {
  const [horas, minutos] = hhmm.split(':').map(Number)
  const data = new Date(segunda)
  data.setDate(segunda.getDate() + dia)
  data.setHours(horas, minutos, 0, 0)
  return data
}

/** Gera as reservas de demonstração relativas à semana de `hoje`, para a agenda nunca aparecer vazia. */
export function gerarReservas(hoje: Date = new Date()): Reserva[] {
  const segunda = inicioDaSemana(hoje)
  return MODELOS.map((modelo, i) => ({
    id: `r-${String(i + 1).padStart(3, '0')}`,
    salaId: modelo.salaId,
    usuarioId: modelo.usuarioId,
    inicio: horario(segunda, modelo.dia, modelo.inicio).toISOString(),
    fim: horario(segunda, modelo.dia, modelo.fim).toISOString(),
    motivo: modelo.motivo,
    status: modelo.status ?? 'ativa',
    criadaEm: horario(segunda, -7, '08:00').toISOString(),
  }))
}
