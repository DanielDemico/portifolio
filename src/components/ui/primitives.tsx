import { motion, type HTMLMotionProps } from 'motion/react'
import { useRef, type ReactNode, type PointerEvent } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

/** Revela o conteúdo ao entrar na tela (sobe + aparece). */
export function Reveal({ delay = 0, y = 24, ...props }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...props}
    />
  )
}

/** Cabeçalho padrão de seção: rótulo numerado + título + subtítulo. */
export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-10 max-w-2xl sm:mb-14">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-bold text-fg sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted sm:text-lg">{subtitle}</p>}
    </Reveal>
  )
}

/** Card com "holofote" que segue o cursor (desktop). No toque, fica como card normal. */
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-elevated transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/50 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 60%)' }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

type ButtonProps = { href: string; children: ReactNode; variant?: 'accent' | 'ghost'; external?: boolean }

/** Link com cara de botão. `accent` = lima da marca (CTA principal). */
export function ButtonLink({ href, children, variant = 'accent', external }: ButtonProps) {
  const base =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 active:scale-[0.97]'
  const styles =
    variant === 'accent'
      ? 'bg-accent text-accent-contrast shadow-[0_8px_30px_-8px_var(--glow)] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_var(--glow)]'
      : 'border border-border bg-elevated/60 text-fg backdrop-blur hover:border-primary hover:text-primary'
  return (
    <a
      href={href}
      className={`${base} ${styles}`}
      {...(external && { target: '_blank', rel: 'noreferrer noopener' })}
    >
      {children}
    </a>
  )
}
