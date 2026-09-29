import { Search, SlidersHorizontal, X } from 'lucide-react'
import { IconeRecurso } from '@/components/icone-recurso'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { filtroVazio, NOMES_RECURSOS, type FiltroSalas } from '@/domain/salas'
import type { Recurso } from '@/domain/tipos'
import { cn } from '@/lib/utils'

const CAPACIDADES = [0, 10, 20, 40, 80]
const TODOS = '__todos__'

export function FiltrosSalas({
  filtro,
  blocos,
  aoMudar,
}: {
  filtro: FiltroSalas
  blocos: string[]
  aoMudar: (filtro: FiltroSalas) => void
}) {
  const recursos = filtro.recursos ?? []

  function alternarRecurso(recurso: Recurso) {
    aoMudar({
      ...filtro,
      recursos: recursos.includes(recurso) ? recursos.filter((r) => r !== recurso) : [...recursos, recurso],
    })
  }

  return (
    <div className="bg-card/60 space-y-4 rounded-2xl border p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={filtro.busca ?? ''}
            onChange={(e) => aoMudar({ ...filtro, busca: e.target.value })}
            placeholder="Buscar por nome, bloco ou descrição…"
            className="h-10 pl-9"
            aria-label="Buscar salas"
          />
        </div>
        <Select
          value={filtro.bloco ?? TODOS}
          onValueChange={(valor) => aoMudar({ ...filtro, bloco: valor === TODOS ? undefined : valor })}
        >
          <SelectTrigger className="h-10 w-full md:w-72" aria-label="Filtrar por bloco">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos os blocos</SelectItem>
            {blocos.map((bloco) => (
              <SelectItem key={bloco} value={bloco}>
                {bloco}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(filtro.capacidadeMinima ?? 0)}
          onValueChange={(valor) => aoMudar({ ...filtro, capacidadeMinima: Number(valor) || undefined })}
        >
          <SelectTrigger className="h-10 w-full md:w-48" aria-label="Capacidade mínima">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CAPACIDADES.map((c) => (
              <SelectItem key={c} value={String(c)}>
                {c === 0 ? 'Qualquer capacidade' : `${c}+ lugares`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground mr-1 flex items-center gap-1.5 text-xs font-medium">
          <SlidersHorizontal className="size-3.5" /> Recursos
        </span>
        {(Object.keys(NOMES_RECURSOS) as Recurso[]).map((recurso) => {
          const ativo = recursos.includes(recurso)
          return (
            <button
              key={recurso}
              type="button"
              aria-pressed={ativo}
              onClick={() => alternarRecurso(recurso)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all',
                ativo
                  ? 'border-primary bg-primary text-primary-foreground shadow-primary/25 shadow-md'
                  : 'bg-background hover:border-primary/40 hover:text-foreground text-muted-foreground',
              )}
            >
              <IconeRecurso recurso={recurso} className="size-3.5" />
              {NOMES_RECURSOS[recurso]}
            </button>
          )
        })}
        {!filtroVazio(filtro) && (
          <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={() => aoMudar({})}>
            <X /> Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
