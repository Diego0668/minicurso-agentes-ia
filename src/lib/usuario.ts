import { createContext, useContext } from 'react'
import type { Usuario } from '@/domain/tipos'

export interface ContextoUsuario {
  usuarios: Usuario[]
  usuarioAtual: Usuario | undefined
  selecionarUsuario: (id: string) => void
}

export const UsuarioContext = createContext<ContextoUsuario | null>(null)

/** Usuário de demonstração selecionado no cabeçalho (não há autenticação real). */
export function useUsuario(): ContextoUsuario {
  const contexto = useContext(UsuarioContext)
  if (!contexto) throw new Error('useUsuario precisa estar dentro de <ProvedorUsuario>')
  return contexto
}

export function iniciais(nome: string): string {
  const partes = nome
    .replace(/^(Prof\.|Profa\.)\s*/, '')
    .split(/\s+/)
    .filter(Boolean)
  return ((partes[0]?.[0] ?? '') + (partes.at(-1)?.[0] ?? '')).toUpperCase()
}
