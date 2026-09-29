import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PapelUsuario } from '@/domain/tipos'
import { iniciais, useUsuario } from '@/lib/usuario'
import { cn } from '@/lib/utils'

const PAPEIS: Record<PapelUsuario, string> = { docente: 'Docente', discente: 'Discente', tecnico: 'Técnica(o)' }

export function Avatar({ nome, className }: { nome: string; className?: string }) {
  return (
    <span
      className={cn(
        'from-primary flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br to-fuchsia-500 text-[11px] font-semibold text-white',
        className,
      )}
    >
      {iniciais(nome)}
    </span>
  )
}

export function SeletorUsuario() {
  const { usuarios, usuarioAtual, selecionarUsuario } = useUsuario()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2.5 pr-2 pl-1.5" disabled={!usuarioAtual}>
          {usuarioAtual ? <Avatar nome={usuarioAtual.nome} /> : <span className="bg-muted size-7 rounded-full" />}
          <span className="hidden max-w-40 flex-col items-start leading-tight sm:flex">
            <span className="truncate text-sm">{usuarioAtual?.nome ?? 'Carregando…'}</span>
            <span className="text-muted-foreground text-[11px] font-normal">
              {usuarioAtual ? PAPEIS[usuarioAtual.papel] : ''}
            </span>
          </span>
          <ChevronsUpDown className="text-muted-foreground size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
          Usar o sistema como… (demonstração, sem senha)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={usuarioAtual?.id} onValueChange={selecionarUsuario}>
          {usuarios.map((usuario) => (
            <DropdownMenuRadioItem key={usuario.id} value={usuario.id} className="py-2">
              <Avatar nome={usuario.nome} />
              <span className="flex flex-col leading-tight">
                <span>{usuario.nome}</span>
                <span className="text-muted-foreground text-xs">
                  {PAPEIS[usuario.papel]} · {usuario.unidade}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
