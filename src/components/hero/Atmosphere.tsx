import { motion, type MotionValue } from 'motion/react'
import { useId, useMemo } from 'react'

/** Camadas da cena do hero: estrelas, partículas, terreno, grão e vinheta. Todas decorativas. */

// PRNG determinístico → nada "pula" entre renders
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type XY = { x: MotionValue<number>; y: MotionValue<number> }

/** Campo de estrelas. */
export function Stars({ x, y, count = 110 }: XY & { count?: number }) {
  const stars = useMemo(() => {
    const rnd = mulberry32(7)
    return Array.from({ length: count }, () => ({
      left: rnd() * 100,
      top: rnd() * 100,
      size: rnd() < 0.88 ? 1 : 2,
      opacity: 0.2 + rnd() * 0.6,
      twinkle: rnd() < 0.3,
      delay: rnd() * 6,
      dur: 3 + rnd() * 4,
    }))
  }, [count])

  return (
    <motion.div aria-hidden style={{ x, y }} className="pointer-events-none absolute -inset-8 will-change-transform">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-brand-offwhite ${s.twinkle ? 'animate-twinkle' : ''}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </motion.div>
  )
}

/** Partículas roxas brilhantes subindo devagar (perto da borda iluminada da lua). */
export function Particles({ count = 18 }: { count?: number }) {
  const parts = useMemo(() => {
    const rnd = mulberry32(21)
    return Array.from({ length: count }, () => ({
      left: 45 + rnd() * 52,
      top: 20 + rnd() * 70,
      size: 2 + rnd() * 3,
      delay: rnd() * -14,
      dur: 10 + rnd() * 10,
    }))
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {parts.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Formato de cada crista: montes gaussianos (x central, raio, altura) + ruído suave.
 * `near` = rocha em primeiro plano (pico à direita, sob a lua);
 * `far`  = crista mais distante e mais baixa, com picos à esquerda para equilibrar a cena.
 */
const RIDGES = {
  near: { seed: 5, mounds: [[1010, 250, 170], [640, 260, 70], [220, 300, 30]], rough: 7 },
  far: { seed: 13, mounds: [[260, 320, 150], [1420, 260, 105], [820, 380, 40]], rough: 4 },
} as const

/**
 * Terreno lunar: silhueta rochosa com luz de contorno à direita.
 * As cores vêm dos tokens `--rock-*` (global.css), então a mesma crista funciona nos dois temas:
 * à noite é rocha escura com contorno lilás; de dia é lilás em perspectiva atmosférica.
 * A base sempre termina em `--bg`, fundindo o hero com a seção seguinte (sem emenda).
 */
export function Terrain({ x, y, layer = 'near', tone }: XY & { layer?: 'near' | 'far'; tone: 'light' | 'dark' }) {
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => `${n}-${layer}-${uid}`
  const d = useMemo(() => {
    const { seed, mounds, rough } = RIDGES[layer]
    const rnd = mulberry32(seed)
    const W = 1600
    const H = 260
    const pts: string[] = []
    let jitter = 0
    for (let px = 0; px <= W; px += 8) {
      jitter = jitter * 0.7 + (rnd() - 0.5) * rough
      const mound = mounds.reduce((acc, [cx, w, h]) => acc + h * Math.exp(-(((px - cx) / w) ** 2)), 0)
      const yv = H - 18 - mound + jitter
      pts.push(`${px},${Math.max(4, Math.min(H, yv)).toFixed(1)}`)
    }
    return { top: `M${pts.join(' L')}`, fill: `M0,${H} L${pts.join(' L')} L${W},${H} Z` }
  }, [layer])

  const v = (name: string) => `var(--rock-${layer}-${name})`
  const far = layer === 'far'

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      // will-change: o SVG (com filtros) é rasterizado uma vez e só deslocado na GPU no parallax/scroll
      className={`pointer-events-none absolute inset-x-[-3%] bottom-0 will-change-transform ${
        far ? 'h-[clamp(170px,38svh,380px)]' : 'h-[clamp(140px,30svh,300px)]'
      }`}
    >
      <svg viewBox="0 0 1600 260" preserveAspectRatio="xMidYMax slice" className="size-full">
        <defs>
          <linearGradient id={id('fill')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: v('top') }} />
            <stop offset="0.55" style={{ stopColor: v('mid') }} />
            <stop offset="1" style={{ stopColor: v('base') }} />
          </linearGradient>
          <linearGradient id={id('light')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.35" style={{ stopColor: 'var(--rock-shine)' }} stopOpacity="0" />
            <stop offset="0.7" style={{ stopColor: 'var(--rock-shine)' }} stopOpacity="0.05" />
            <stop offset="1" style={{ stopColor: 'var(--rock-shine)' }} stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.3" style={{ stopColor: 'var(--rock-rim)' }} stopOpacity="0" />
            <stop offset="0.75" style={{ stopColor: 'var(--rock-rim)' }} stopOpacity="0.85" />
            <stop offset="1" style={{ stopColor: 'var(--rock-rim-end)' }} stopOpacity="0.6" />
          </linearGradient>
          {/* grão da rocha: claro sobre rocha escura, escuro sobre rocha clara */}
          <filter id={id('grain')} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.55" numOctaves="2" seed="4" />
            <feColorMatrix
              values={
                tone === 'dark'
                  ? '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.35'
                  : '0 0 0 0 0.18  0 0 0 0 0.06  0 0 0 0 0.4  0 0 0 0.9 -0.35'
              }
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={id('blur')}>
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <path d={d.fill} fill={`url(#${id('fill')})`} />
        <path d={d.fill} fill={`url(#${id('light')})`} />
        <path d={d.fill} fill="#fff" filter={`url(#${id('grain')})`} opacity={far ? 0.04 : 0.07} />
        {!far && (
          <path d={d.top} fill="none" stroke={`url(#${id('rim')})`} strokeWidth="10" filter={`url(#${id('blur')})`} opacity="0.35" />
        )}
        <path d={d.top} fill="none" stroke={`url(#${id('rim')})`} strokeWidth={far ? 1 : 1.4} opacity={far ? 0.35 : 1} />
      </svg>
      {/* chão extra: o terreno sobe no scroll e não pode deixar buraco embaixo */}
      {!far && <div className="absolute inset-x-0 top-full h-32 bg-bg" />}
    </motion.div>
  )
}

/** Grão de filme animado + vinheta nas bordas. */
export function FilmLayers() {
  return (
    <>
      <div aria-hidden className="film-vignette pointer-events-none absolute inset-0" />
      {/* sobra de 5% basta: a animação desloca no máximo 3% */}
      <div aria-hidden className="film-grain pointer-events-none absolute -inset-[5%]" />
    </>
  )
}
