import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useTema } from '@/lib/tema'

function Toaster(props: ToasterProps) {
  const { temaEfetivo } = useTema()
  return (
    <Sonner
      theme={temaEfetivo === 'escuro' ? 'dark' : 'light'}
      richColors
      closeButton
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
