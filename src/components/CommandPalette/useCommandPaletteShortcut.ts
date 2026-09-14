import { useEffect } from 'react'

/** Binds ⌘K (Mac) / Ctrl+K (Windows/Linux) to open the command palette. */
export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpen()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onOpen])
}
