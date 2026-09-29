import { Accessibility, AirVent, Cpu, Projector, Presentation, Video } from 'lucide-react'
import type { Recurso } from '@/domain/tipos'

const ICONES: Record<Recurso, typeof Cpu> = {
  projetor: Projector,
  computadores: Cpu,
  'ar-condicionado': AirVent,
  'quadro-digital': Presentation,
  videoconferencia: Video,
  acessibilidade: Accessibility,
}

export function IconeRecurso({ recurso, className }: { recurso: Recurso; className?: string }) {
  const Icone = ICONES[recurso]
  return <Icone className={className} aria-hidden />
}
