import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, DoorClosed, Info, MapPin, Plus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AgendaSemanal } from '@/components/agenda-semanal'
import { EstadoErro, EstadoVazio } from '@/components/estados'
import { IconeRecurso } from '@/components/icone-recurso'
import { IconeSala } from '@/components/icone-sala'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { diasDaSemana, inicioDaSemana } from '@/domain/agenda'
import { NOMES_RECURSOS, NOMES_TIPOS } from '@/domain/salas'
import { useConsulta } from '@/hooks/use-consulta'
import { api, ErroApi } from '@/lib/api'
import { useUsuario } from '@/lib/usuario'

export function PaginaSala({ id }: { id: string }) {
  const { usuarios, usuarioAtual } = useUsuario()
  const [segunda, setSegunda] = useState(() => inicioDaSemana(new Date()))
  const dias = useMemo(() => diasDaSemana(segunda), [segunda])
  const [modalAberto, setModalAberto] = useState(false)

  const sala = useConsulta(() => api.buscarSala(id), [id])
  const reservas = useConsulta(() => api.listarReservasDaSala(id, segunda, addDays(segunda, 7)), [id, segunda])

  if (sala.erro instanceof ErroApi && sala.erro.status === 404) {
    return (
      <EstadoVazio
        icone={DoorClosed}
        titulo="Sala não encontrada"
        descricao="O endereço pode estar errado ou a sala foi removida do sistema."
        acao={
          <Button asChild variant="outline">
            <a href="#/">
              <ArrowLeft /> Ver todas as salas
            </a>
          </Button>
        }
      />
    )
  }
  if (sala.erro) return <EstadoErro erro={sala.erro} aoTentarDeNovo={sala.recarregar} />

  const semanaAtual = inicioDaSemana(new Date()).getTime() === segunda.getTime()
  const totalSemana = reservas.dados?.length ?? 0

  return (
    <div className="space-y-6">
      <a href="#/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors">
        <ArrowLeft className="size-4" /> Todas as salas
      </a>

      {!sala.dados ? (
        <Skeleton className="h-36 rounded-3xl" />
      ) : (
        <section className="bg-card relative overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-8">
          <div className="from-primary/10 absolute -top-24 -right-24 size-72 rounded-full bg-gradient-to-br to-fuchsia-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <IconeSala tipo={sala.dados.tipo} className="size-14 rounded-2xl [&_svg]:size-7" />
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {NOMES_TIPOS[sala.dados.tipo]}
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{sala.dados.nome}</h1>
                <p className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" /> {sala.dados.bloco} · {sala.dados.andar}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" /> {sala.dados.capacidade} lugares
                  </span>
                </p>
                <p className="max-w-2xl text-sm">{sala.dados.descricao}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
              {sala.dados.recursos.map((recurso) => (
                <span key={recurso} className="bg-secondary flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <IconeRecurso recurso={recurso} className="text-primary size-3.5" />
                  {NOMES_RECURSOS[recurso]}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CalendarDays className="text-primary size-5" /> Agenda da semana
            </h2>
            <p className="text-muted-foreground text-sm">
              {format(dias[0], "d 'de' MMM", { locale: ptBR })} a {format(dias.at(-1)!, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
              {reservas.dados && ` · ${totalSemana} ${totalSemana === 1 ? 'reserva' : 'reservas'}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={modalAberto} onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" /> Reservar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reservar {sala.dados?.nome}</DialogTitle>
                  <DialogDescription>
                    Preencha os dados abaixo para fazer a reserva.
                  </DialogDescription>
                </DialogHeader>
                <FormularioReserva
                  salaId={id}
                  usuarioAtualId={usuarioAtual?.id ?? ''}
                  usuarios={usuarios}
                  aoCriar={() => {
                    setModalAberto(false)
                    reservas.recarregar()
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" aria-label="Semana anterior" onClick={() => setSegunda(addDays(segunda, -7))}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" disabled={semanaAtual} onClick={() => setSegunda(inicioDaSemana(new Date()))}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" aria-label="Próxima semana" onClick={() => setSegunda(addDays(segunda, 7))}>
              <ChevronRight />
            </Button>
          </div>
        </div>

        {reservas.erro ? (
          <EstadoErro erro={reservas.erro} aoTentarDeNovo={reservas.recarregar} />
        ) : !reservas.dados ? (
          <Skeleton className="h-[720px] rounded-2xl" />
        ) : (
          <>
            <AgendaSemanal dias={dias} reservas={reservas.dados} usuarios={usuarios} usuarioAtualId={usuarioAtual?.id} />
            {totalSemana === 0 && (
              <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                <Info className="size-4" /> Nenhuma reserva nesta semana — a sala está livre em todos os horários.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  )
}

function FormularioReserva({
  salaId,
  usuarioAtualId,
  usuarios,
  aoCriar,
}: {
  salaId: string
  usuarioAtualId: string
  usuarios: { id: string; nome: string }[]
  aoCriar: () => void
}) {
  const [usuarioId, setUsuarioId] = useState(usuarioAtualId)
  const [data, setData] = useState(() => {
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    return amanha.toISOString().split('T')[0]
  })
  const [horaInicio, setHoraInicio] = useState('14:00')
  const [horaFim, setHoraFim] = useState('16:00')
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const inicio = new Date(`${data}T${horaInicio}:00`).toISOString()
      const fim = new Date(`${data}T${horaFim}:00`).toISOString()

      await api.criarReserva({
        salaId,
        usuarioId,
        inicio,
        fim,
        motivo,
      })

      aoCriar()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao criar reserva.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="usuario">Usuário</Label>
        <Select value={usuarioId} onValueChange={setUsuarioId}>
          <SelectTrigger id="usuario">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data">Data</Label>
        <Input
          id="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hora-inicio">Início</Label>
          <Input
            id="hora-inicio"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hora-fim">Fim</Label>
          <Input
            id="hora-fim"
            type="time"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo</Label>
        <Textarea
          id="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ex.: Aula de Algoritmos, Reunião de grupo..."
          required
        />
      </div>

      {erro && (
        <p className="text-destructive text-sm">{erro}</p>
      )}

      <Button type="submit" disabled={carregando} className="w-full">
        {carregando ? 'Reservando...' : 'Confirmar reserva'}
      </Button>
    </form>
  )
}
