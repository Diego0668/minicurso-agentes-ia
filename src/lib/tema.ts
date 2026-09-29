import { createContext, useContext } from 'react'

export type Tema = 'claro' | 'escuro' | 'sistema'

export interface ContextoTema {
  tema: Tema
  temaEfetivo: 'claro' | 'escuro'
  definirTema: (tema: Tema) => void
}

export const TemaContext = createContext<ContextoTema | null>(null)

export function useTema(): ContextoTema {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema precisa estar dentro de <ProvedorTema>')
  return contexto
}
