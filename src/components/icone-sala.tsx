import { Monitor, Presentation, School, UsersRound } from 'lucide-react'
import type { TipoSala } from '@/domain/tipos'
import { cn } from '@/lib/utils'

const ESTILOS: Record<TipoSala, { icone: typeof Monitor; cor: string }> = {
  laboratorio: { icone: Monitor, cor: 'from-violet-500 to-indigo-600 shadow-indigo-500/30' },
  'sala-de-aula': { icone: School, cor: 'from-sky-500 to-blue-600 shadow-blue-500/30' },
  auditorio: { icone: Presentation, cor: 'from-amber-400 to-orange-500 shadow-orange-500/30' },
  reuniao: { icone: UsersRound, cor: 'from-emerald-400 to-teal-600 shadow-teal-500/30' },
}

export function IconeSala({ tipo, className }: { tipo: TipoSala; className?: string }) {
  const { icone: Icone, cor } = ESTILOS[tipo]
  return (
    <div
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
        cor,
        className,
      )}
    >
      <Icone className="size-5" />
    </div>
  )
}
