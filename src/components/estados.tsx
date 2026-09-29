import type { LucideIcon } from 'lucide-react'
import { RefreshCw, ServerCrash } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EstadoVazio({
  icone: Icone,
  titulo,
  descricao,
  acao,
  className,
}: {
  icone: LucideIcon
  titulo: string
  descricao: ReactNode
  acao?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center',
        className,
      )}
    >
      <div className="relative">
        <div className="bg-primary/15 absolute inset-0 scale-150 rounded-full blur-2xl" />
        <div className="bg-card relative flex size-16 items-center justify-center rounded-2xl border shadow-sm">
          <Icone className="text-primary size-7" />
        </div>
      </div>
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-lg font-semibold">{titulo}</h3>
        <p className="text-muted-foreground text-sm text-balance">{descricao}</p>
      </div>
      {acao}
    </div>
  )
}

export function EstadoErro({ erro, aoTentarDeNovo }: { erro: Error; aoTentarDeNovo?: () => void }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-4 rounded-2xl border px-6 py-14 text-center">
      <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-2xl">
        <ServerCrash className="size-7" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-semibold">Algo deu errado</h3>
        <p className="text-muted-foreground text-sm">{erro.message}</p>
      </div>
      {aoTentarDeNovo && (
        <Button variant="outline" onClick={aoTentarDeNovo}>
          <RefreshCw /> Tentar de novo
        </Button>
      )}
    </div>
  )
}
