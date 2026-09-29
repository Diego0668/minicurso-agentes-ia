import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import { ProvedorTema } from '@/components/provedor-tema'
import { ProvedorUsuario } from '@/components/provedor-usuario'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProvedorTema>
      <ProvedorUsuario>
        <TooltipProvider>
          <App />
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </ProvedorUsuario>
    </ProvedorTema>
  </StrictMode>,
)
