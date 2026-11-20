import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { BrandMark, BRAND_MARK_DURATION } from './BrandMark'
import { useI18n } from '@/i18n/I18nProvider'
import { site } from '@/config/site'

/**
 * INTRO — carregamento falso + logo surgindo peça por peça + nome.
 * Depois, a tela desliza para a ESQUERDA (duas camadas: conteúdo e uma faixa roxa
 * logo atrás) revelando o site, que já está renderizado por baixo.
 *
 * Fases: 'loading' → 'leaving' → onDone() (o pai desmonta este componente).
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

type Phase = 'loading' | 'leaving'

type IntroProps = {
  /** Chamado quando a cortina COMEÇA a sair → o site já pode iniciar a entrada (mesma direção). */
  onLeave?: () => void
  /** Chamado quando a cortina terminou de sair → desmontar a intro. */
  onDone: () => void
}

export function Intro({ onLeave, onDone }: IntroProps) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('loading')

  useEffect(() => {
    if (phase === 'leaving') onLeave?.()
  }, [phase, onLeave])

  const total = reduce ? 0.6 : site.introDurationMs / 1000
  const nameDelay = reduce ? 0 : BRAND_MARK_DURATION - 0.3

  // Contador de "carregamento" com pausas irregulares para parecer real.
  const progress = useMotionValue(0)
  const percent = useTransform(progress, (v) => String(Math.round(v)).padStart(3, '0'))
  const barScale = useTransform(progress, (v) => v / 100)

  useEffect(() => {
    const controls = animate(progress, [0, 18, 46, 52, 81, 94, 100], {
      duration: total,
      times: [0, 0.14, 0.38, 0.5, 0.72, 0.86, 1],
      ease: 'easeInOut',
      onComplete: () => setPhase('leaving'),
    })
    return () => controls.stop()
  }, [progress, total])

  // Trava a rolagem enquanto a intro está na tela.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const leaving = phase === 'leaving'
  const letters = Array.from(site.name)

  return (
    <div className="fixed inset-0 z-[100]" aria-live="polite" aria-busy={!leaving}>
      {/* Camada de trás: faixa roxa que sai um instante depois (efeito "cortina dupla") */}
      <motion.div
        className="absolute inset-0 bg-primary will-change-transform"
        initial={{ x: 0 }}
        animate={leaving ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_IN_OUT, delay: reduce ? 0 : 0.14 }}
        onAnimationComplete={() => leaving && onDone()}
      />

      {/* Camada da frente: conteúdo da intro */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-bg px-4 will-change-transform"
        initial={{ x: 0 }}
        animate={leaving ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_IN_OUT }}
      >
        {/* brilho de fundo (o radial-gradient já é suave: um blur por cima só custava desempenho) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--glow), transparent 65%)' }}
        />

        <motion.div
          animate={leaving ? { scale: 0.92, opacity: 0.6 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="relative flex flex-col items-center"
        >
          <BrandMark size="clamp(110px, 26vmin, 180px)" animated={!reduce} />

          {/* Nome: letras sobem de dentro de uma máscara */}
          <h1
            className="mt-8 flex overflow-hidden font-display text-[clamp(1.6rem,6vw,2.75rem)] font-extrabold uppercase leading-none tracking-[0.06em] text-fg sm:mt-10"
            aria-label={site.name}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden
                className={i === letters.length - 1 ? 'text-primary' : undefined}
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: nameDelay + i * 0.035 }}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Barra de carregamento falso */}
        <div className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] mx-auto w-[min(22rem,80vw)]">
          <div className="mb-2 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span>{t.intro.loading}</span>
            <span className="tabular-nums text-fg">
              <motion.span>{percent}</motion.span>%
            </span>
          </div>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-border">
            <motion.div className="h-full origin-left bg-primary" style={{ scaleX: barScale }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPhase('leaving')}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-subtle transition-colors hover:text-fg"
        >
          {t.intro.skip}
        </button>
      </motion.div>
    </div>
  )
}
