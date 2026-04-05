import { useEffect, useRef, useState } from 'react'

function motionReduced() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Eased count from current value to `target` when `target` changes.
 * First paint animates from 0 → target (opening effect).
 */
export function useAnimatedNumber(target: number, durationMs = 1100, delayMs = 0) {
  const [display, setDisplay] = useState(() => (motionReduced() ? target : 0))
  const displayRef = useRef(motionReduced() ? target : 0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (motionReduced()) {
      displayRef.current = target
      setDisplay(target)
      return
    }

    const startVal = displayRef.current
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

    const run = () => {
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        const next = startVal + (target - startVal) * easeOutCubic(t)
        displayRef.current = next
        setDisplay(next)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          displayRef.current = target
          setDisplay(target)
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    const t = window.setTimeout(run, delayMs)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs, delayMs])

  return display
}
