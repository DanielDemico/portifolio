import { motion, type Transition } from 'motion/react'
import { useId } from 'react'

/**
 * Símbolo da marca (espiral de crescentes), copiado da malha 100×100 do guia de marca.
 * USO RESTRITO: apenas na Intro. Em outros lugares do site, não use a logo.
 *
 * As cores vêm de tokens CSS (--logo-from, --logo-to, --logo-rings), então a
 * versão "fundo claro" e "fundo escuro" trocam sozinhas com o tema.
 */

// Peças da lua, de fora para dentro (ordem em que surgem na animação).
const PIECES = [
  { id: 'outer', d: 'M56.66 96.94A47.68 47.68 0 1 1 89.81 27.42A39.35 39.35 0 1 0 56.66 96.94Z', fill: 'outer' },
  { id: 'ring2', d: 'M47 86.81A33.86 33.86 0 1 1 98.46 67.6A28.74 28.74 0 1 0 47 86.81Z', fill: 'rings' },
  { id: 'ring3', d: 'M52.18 60.85A18.39 18.39 0 1 1 79.48 81.85A17.27 17.27 0 0 0 52.18 60.85Z', fill: 'rings' },
] as const

const SPHERE = { cx: 62.77, cy: 73.28, r: 11.35 }

// Centro da espiral: as peças "giram" e crescem a partir daqui.
const ORIGIN = { transformOrigin: `${SPHERE.cx}px ${SPHERE.cy}px`, transformBox: 'view-box' } as const

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  size?: number | string
  /** Anima o surgimento peça por peça. */
  animated?: boolean
  /** Atraso inicial (s). */
  delay?: number
  /** Intervalo entre peças (s). */
  stagger?: number
  className?: string
}

export function BrandMark({ size = 160, animated = true, delay = 0.1, stagger = 0.32, className }: Props) {
  const uid = useId().replace(/:/g, '')
  const outerId = `bm-outer-${uid}`
  const sphereId = `bm-sphere-${uid}`

  const fillFor = (f: 'outer' | 'rings') => (f === 'outer' ? `url(#${outerId})` : 'var(--logo-rings)')

  const piece = (i: number) => {
    if (!animated) return {}
    const start = delay + i * stagger
    const t = (extra: Partial<Transition> = {}): Transition => ({ duration: 0.8, ease: EASE, delay: start, ...extra })
    return {
      initial: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1, scale: 0.55, rotate: -50, opacity: 0 },
      animate: { pathLength: 1, fillOpacity: 1, strokeOpacity: 0, scale: 1, rotate: 0, opacity: 1 },
      transition: {
        opacity: t({ duration: 0.2 }),
        pathLength: t({ duration: 0.7 }),
        scale: t({ duration: 0.9 }),
        rotate: t({ duration: 1 }),
        fillOpacity: t({ duration: 0.5, delay: start + 0.45 }),
        strokeOpacity: t({ duration: 0.4, delay: start + 0.7 }),
      },
    }
  }

  const sphereStart = delay + PIECES.length * stagger

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={outerId} x1="15.1" y1="18.2" x2="42.8" y2="94.2" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--logo-from)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-to)' }} />
        </linearGradient>
        <linearGradient id={sphereId} x1="55.2" y1="65.9" x2="70.1" y2="80.3" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--logo-to)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-from)' }} />
        </linearGradient>
      </defs>

      {PIECES.map((p, i) => (
        <motion.path
          key={p.id}
          d={p.d}
          fill={fillFor(p.fill)}
          stroke="var(--primary)"
          strokeWidth={0.6}
          strokeOpacity={animated ? undefined : 0}
          style={ORIGIN}
          {...piece(i)}
        />
      ))}

      {/* Esfera: fecha a espiral com um "pop" de mola */}
      <motion.circle
        cx={SPHERE.cx}
        cy={SPHERE.cy}
        r={SPHERE.r}
        fill={`url(#${sphereId})`}
        style={ORIGIN}
        {...(animated && {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { type: 'spring', stiffness: 320, damping: 14, delay: sphereStart },
        })}
      />
    </svg>
  )
}

/** Tempo (s) até a última peça terminar de surgir — usado pela Intro para sincronizar o nome. */
export const BRAND_MARK_DURATION = 0.1 + PIECES.length * 0.32 + 0.5
