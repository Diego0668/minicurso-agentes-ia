import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { TemaContext, type Tema } from '@/lib/tema'

function lerTemaSalvo(): Tema {
  try {
    const salvo = localStorage.getItem('tema')
    if (salvo === 'claro' || salvo === 'escuro' || salvo === 'sistema') return salvo
  } catch {
    // localStorage indisponível: segue o sistema
  }
  return 'sistema'
}

const consultaEscuro = () => window.matchMedia('(prefers-color-scheme: dark)')

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(lerTemaSalvo)
  const [sistemaEscuro, setSistemaEscuro] = useState(() => consultaEscuro().matches)

  useEffect(() => {
    const mq = consultaEscuro()
    const aoMudar = () => setSistemaEscuro(mq.matches)
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [])

  const temaEfetivo = tema === 'sistema' ? (sistemaEscuro ? 'escuro' : 'claro') : tema

  useEffect(() => {
    document.documentElement.classList.toggle('dark', temaEfetivo === 'escuro')
  }, [temaEfetivo])

  const valor = useMemo(
    () => ({
      tema,
      temaEfetivo,
      definirTema: (novo: Tema) => {
        setTema(novo)
        try {
          localStorage.setItem('tema', novo)
        } catch {
          // ignora
        }
      },
    }),
    [tema, temaEfetivo],
  )

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>
}
