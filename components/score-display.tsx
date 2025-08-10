"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type ScoreDisplayProps = {
  score?: number // 0-100
  label?: string
  size?: number
  className?: string
}

export function ScoreDisplay({ score = 72, label = "Total Score", size = 140, className = "" }: ScoreDisplayProps) {
  const [animated, setAnimated] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const duration = 900
    const start = performance.now()
    const startVal = 0
    const endVal = Math.max(0, Math.min(100, score))
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const ease = 1 - Math.pow(1 - p, 3)
      setAnimated(Math.round(startVal + (endVal - startVal) * ease))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [score])

  const stroke = `conic-gradient(rgb(79 70 229) ${animated * 3.6}deg, hsl(var(--muted)) ${animated * 3.6}deg)`

  return (
    <div className={cn("grid place-items-center gap-3", className)}>
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: stroke,
        }}
        aria-label={`Score ${animated} out of 100`}
        role="img"
      >
        <div className="absolute rounded-full bg-background" style={{ width: size - 16, height: size - 16 }} />
        <div className="relative text-center">
          <div className="text-4xl font-bold">{animated}</div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  )
}
