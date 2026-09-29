import { CalendarRange } from 'lucide-react'
import { AlternarTema } from '@/components/alternar-tema'
import { SeletorUsuario } from '@/components/seletor-usuario'

export function Cabecalho() {
  return (
    <header className="bg-background/75 sticky top-0 z-40 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#/" className="group flex items-center gap-2.5">
          <span className="from-primary flex size-9 items-center justify-center rounded-xl bg-gradient-to-br to-fuchsia-500 text-white shadow-md transition-transform group-hover:scale-105">
            <CalendarRange className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold tracking-tight">Reserva de Salas</span>
            <span className="text-muted-foreground block text-[11px]">UFMT · Campus Cuiabá</span>
          </span>
        </a>
        <nav className="ml-4 hidden items-center gap-1 text-sm md:flex">
          <a href="#/" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-1.5 transition-colors">
            Salas
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <AlternarTema />
          <SeletorUsuario />
        </div>
      </div>
    </header>
  )
}
