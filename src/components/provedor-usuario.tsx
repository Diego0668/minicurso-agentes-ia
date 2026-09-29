import { useMemo, useState, type ReactNode } from 'react'
import { useConsulta } from '@/hooks/use-consulta'
import { api } from '@/lib/api'
import { UsuarioContext } from '@/lib/usuario'

const CHAVE = 'usuario-atual'

function lerSalvo(): string | null {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return null
  }
}

export function ProvedorUsuario({ children }: { children: ReactNode }) {
  const { dados: usuarios = [] } = useConsulta(api.listarUsuarios, [])
  const [idSelecionado, setIdSelecionado] = useState<string | null>(lerSalvo)

  const valor = useMemo(() => {
    const usuarioAtual = usuarios.find((u) => u.id === idSelecionado) ?? usuarios[0]
    return {
      usuarios,
      usuarioAtual,
      selecionarUsuario: (id: string) => {
        setIdSelecionado(id)
        try {
          localStorage.setItem(CHAVE, id)
        } catch {
          // ignora
        }
      },
    }
  }, [usuarios, idSelecionado])

  return <UsuarioContext.Provider value={valor}>{children}</UsuarioContext.Provider>
}
