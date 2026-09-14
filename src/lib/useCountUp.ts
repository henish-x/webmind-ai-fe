import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

/**
 * Animates a number counting up from 0 to `target` once `start` flips true (e.g. a
 * scroll-into-view trigger) — fires exactly once, never resets on re-renders. Pass
 * `instant` (typically `useReducedMotion()`) to skip straight to `target`.
 */
export function useCountUp(target: number, { start = true, duration = 1200, instant = false }: { start?: boolean; duration?: number; instant?: boolean } = {}) {
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (instant || !start || startedRef.current) return
    startedRef.current = true

    let raf: number
    const startTime = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.round(target * easeOutCubic(progress)))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration, instant])

  return instant ? target : value
}
