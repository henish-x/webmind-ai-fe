import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/Toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { seedIfEmpty } from '@/data/seed'
import { router } from '@/router'
import { useAuthStore } from '@/state/useAuthStore'

function App() {
  const session = useAuthStore((s) => s.session)

  useEffect(() => {
    if (session) seedIfEmpty()
  }, [session])

  return (
    <TooltipProvider delayDuration={300}>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  )
}

export default App
