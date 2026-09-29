import { DatabaseSync } from 'node:sqlite'
import { gerarReservas, SALAS, USUARIOS } from './seed'

export type Banco = DatabaseSync

const ESQUEMA = `
  CREATE TABLE IF NOT EXISTS salas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    bloco TEXT NOT NULL,
    andar TEXT NOT NULL,
    tipo TEXT NOT NULL,
    capacidade INTEGER NOT NULL,
    recursos TEXT NOT NULL, -- JSON: ["projetor", ...]
    descricao TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    papel TEXT NOT NULL,
    unidade TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reservas (
    id TEXT PRIMARY KEY,
    sala_id TEXT NOT NULL REFERENCES salas(id),
    usuario_id TEXT NOT NULL REFERENCES usuarios(id),
    inicio TEXT NOT NULL, -- ISO 8601 em UTC
    fim TEXT NOT NULL,
    motivo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'cancelada')),
    criada_em TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_reservas_sala_inicio ON reservas (sala_id, inicio);
`

/**
 * Abre (ou cria) o banco SQLite. Use ':memory:' nos testes.
 * Se o banco estiver vazio, ele é populado com os dados de demonstração.
 */
export function abrirBanco(arquivo = ':memory:', hoje = new Date()): Banco {
  const db = new DatabaseSync(arquivo)
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(ESQUEMA)
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM salas').get() as { total: number }
  if (total === 0) popular(db, hoje)
  return db
}

function popular(db: Banco, hoje: Date) {
  const inserirSala = db.prepare(
    'INSERT INTO salas (id, nome, bloco, andar, tipo, capacidade, recursos, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  )
  const inserirUsuario = db.prepare('INSERT INTO usuarios (id, nome, papel, unidade) VALUES (?, ?, ?, ?)')
  const inserirReserva = db.prepare(
    'INSERT INTO reservas (id, sala_id, usuario_id, inicio, fim, motivo, status, criada_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  )

  db.exec('BEGIN')
  for (const s of SALAS) {
    inserirSala.run(s.id, s.nome, s.bloco, s.andar, s.tipo, s.capacidade, JSON.stringify(s.recursos), s.descricao)
  }
  for (const u of USUARIOS) inserirUsuario.run(u.id, u.nome, u.papel, u.unidade)
  for (const r of gerarReservas(hoje)) {
    inserirReserva.run(r.id, r.salaId, r.usuarioId, r.inicio, r.fim, r.motivo, r.status, r.criadaEm)
  }
  db.exec('COMMIT')
}
