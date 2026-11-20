import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type Transition } from 'motion/react'
import { Fragment, useMemo, useRef, type PointerEvent } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { useTheme } from '@/theme/ThemeProvider'
import { site } from '@/config/site'
import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { MoonBackdrop } from './MoonBackdrop'
import { FilmLayers, Particles, Stars, Terrain } from './Atmosphere'

const CINE = [0.16, 1, 0.3, 1] as const

/**
 * Letras que chegam afastadas e se juntam, SÓ com transform: cada letra parte deslocada
 * a partir do centro do texto (`spread` em em por letra) e volta para x = 0.
 * Substitui animar `letter-spacing`, que recalculava o layout do texto a cada quadro.
 * O espaçamento final vem do `letter-spacing` estático do elemento pai.
 */
function Spread({ text, spread, play, transition }: { text: string; spread: number; play: boolean; transition: Transition }) {
  const words = useMemo(() => {
    const chars = Array.from(text)
    const mid = (chars.length - 1) / 2
    let i = 0
    return text.split(' ').map((w) => {
      const letters = Array.from(w).map((c) => ({ c, offset: (i++ - mid) * spread }))
      i++ // espaço
      return letters
    })
  }, [text, spread])

  return words.map((letters, wi) => (
    <Fragment key={wi}>
      {wi > 0 && ' '}
      {/* palavra inteira não quebra no meio */}
      <span className="inline-block whitespace-nowrap">
        {letters.map(({ c, offset }, ci) => (
          <motion.span
            key={ci}
            className="inline-block"
            initial={{ x: `${offset}em` }}
            animate={play ? { x: '0em' } : undefined}
            transition={transition}
          >
            {c}
          </motion.span>
        ))}
      </span>
    </Fragment>
  ))
}

/**
 * HERO — cena espacial cinematográfica que segue o tema.
 * - Escuro: noite, lua gigante à contraluz, estrelas, rocha escura com contorno lilás.
 * - Claro: "lua de dia", céu lilás pálido, sem estrelas, cristas em perspectiva atmosférica.
 * Camadas, de trás para frente: céu → estrelas → lua (direita, cortada pela borda) →
 * crista distante → partículas → terreno em primeiro plano → texto → grão/vinheta.
 * Cores das camadas vêm dos tokens `--hero-*` / `--rock-*` em global.css.
 * O ponteiro move as camadas em profundidades diferentes (parallax de câmera).
 * `play` vira true quando a intro termina.
 */
export function Hero({ play }: { play: boolean }) {
  const { t } = useI18n()
  const { theme } = useTheme()
  const ref = useRef<HTMLElement>(null)
  // Fora da tela: pausa grão, partículas e estrelas (ver [data-paused] em global.css)
  const inView = useInView(ref)

  // Ponteiro normalizado (-1..1) suavizado → câmera
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 35, damping: 18 })
  const sy = useSpring(py, { stiffness: 35, damping: 18 })
  const layer = (depth: number) => ({
    x: useTransform(sx, (v) => v * depth),
    y: useTransform(sy, (v) => v * depth * 0.6),
  })
  const starsL = layer(-6)
  const moonL = layer(10)
  const ridgeL = layer(15)
  const terrainL = layer(24)

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  // Rolagem: lua desce devagar, terreno sobe rápido (profundidade), texto some
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const moonScrollY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const ridgeScrollY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const terrainScrollY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90])

  const words = site.name.toUpperCase().split(' ')
  /**
   * ENTRADA EM PROFUNDIDADE: a cortina da intro sai para a esquerda, e cada camada
   * entra vindo da DIREITA (mesmo sentido), percorrendo uma distância proporcional
   * à proximidade com a "câmera": estrelas < lua < crista < texto < partículas < terreno.
   * `play` dispara quando a cortina COMEÇA a sair, então o movimento é contínuo.
   */
  const DEPTH = { stars: 50, moon: 180, ridge: 260, text: 300, particles: 380, terrain: 640, ui: 220 } as const
  const enter = (dist: number, delay = 0, dur = 2) => ({
    initial: { opacity: 0, x: dist },
    animate: play ? { opacity: 1, x: 0 } : undefined,
    transition: {
      x: { duration: dur, ease: CINE, delay },
      opacity: { duration: 0.7, ease: 'easeOut' as const, delay },
    },
  })
  // filtros terminam em 'none': `blur(0px)` deixaria uma camada de filtro inútil para sempre
  const show = (delay: number) => ({
    initial: { opacity: 0, x: DEPTH.text * 0.7, filter: 'blur(6px)' },
    animate: play ? { opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : undefined,
    transition: { duration: 1.8, ease: CINE, delay },
  })

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      data-paused={inView ? undefined : ''}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-bg text-fg"
    >
      {/* ---------- Fundo ---------- */}
      <div aria-hidden className="hero-sky pointer-events-none absolute inset-0" />

      {/* estrelas só à noite */}
      <motion.div aria-hidden {...enter(DEPTH.stars, 0, 2.6)} className="pointer-events-none absolute inset-0 hidden dark:block">
        <Stars {...starsL} />
      </motion.div>

      {/* Lua gigante à contraluz, à direita e cortada pelas bordas.
          --d = diâmetro do disco; --rx = onde fica a borda direita; --cy = centro vertical */}
      <motion.div
        aria-hidden
        style={{ y: moonScrollY }}
        className="pointer-events-none absolute inset-0 [--cy:16%] [--d:150vw] [--rx:96%] md:[--cy:22%] md:[--d:min(120svh,92vw)] md:[--rx:97%]"
      >
        {/* canvas = disco × 1.4 (sobra para o brilho) */}
        <motion.div
          {...enter(DEPTH.moon, 0.05, 2.8)}
          className="absolute"
          style={{
            width: 'calc(var(--d) * 1.4)',
            height: 'calc(var(--d) * 1.4)',
            left: 'calc(var(--rx) - var(--d) * 1.2)',
            top: 'calc(var(--cy) - var(--d) * 0.7)',
          }}
        >
          <motion.div style={moonL} className="size-full will-change-transform">
            <MoonBackdrop className="size-full" variant={theme} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Crista distante: entre a lua e as partículas (profundidade intermediária) */}
      <motion.div style={{ y: ridgeScrollY }} className="pointer-events-none absolute inset-0">
        <motion.div {...enter(DEPTH.ridge, 0.05, 2.5)} className="absolute inset-0">
          <Terrain {...ridgeL} layer="far" tone={theme} />
        </motion.div>
      </motion.div>

      <motion.div aria-hidden {...enter(DEPTH.particles, 0.1, 2.4)} className="pointer-events-none absolute inset-0">
        <Particles />
      </motion.div>

      <motion.div style={{ y: terrainScrollY }} className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          // o mais próximo da câmera: maior distância + desfoque de movimento
          initial={{ opacity: 0, x: DEPTH.terrain, filter: 'blur(10px)' }}
          animate={play ? { opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : undefined}
          transition={{
            x: { duration: 2.2, ease: CINE, delay: 0.05 },
            filter: { duration: 1.4, ease: 'easeOut', delay: 0.2 },
            opacity: { duration: 0.5, delay: 0.05 },
          }}
        >
          <Terrain {...terrainL} layer="near" tone={theme} />
        </motion.div>
      </motion.div>

      {/* ---------- Conteúdo ---------- */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="container-page relative z-10 flex flex-col items-center will-change-transform pt-24 pb-[clamp(9rem,28svh,16rem)] text-center sm:pt-28"
      >
        <h1
          aria-label={site.name}
          className="hero-title flex flex-wrap justify-center gap-x-[0.5em] font-display text-[clamp(2.4rem,9vw,6.75rem)] font-bold uppercase leading-[1.02]"
        >
          {words.map((w, i) => {
            const tr = { duration: 2.1, ease: CINE, delay: 0.15 + i * 0.1 }
            return (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0, x: DEPTH.text + i * 140, filter: 'blur(8px)' }}
                animate={play ? { opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : undefined}
                transition={tr}
                // tracking final fixo; a "aproximação" das letras é feita por <Spread> (transform)
                style={{ letterSpacing: '0.12em', marginRight: '-0.12em' /* compensa o tracking da última letra */ }}
              >
                {/* 0.28em = 0.4em (tracking inicial antigo) - 0.12em (final) */}
                <Spread text={w} spread={0.28} play={play} transition={tr} />
              </motion.span>
            )
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, x: DEPTH.text * 0.8 }}
          animate={play ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 2.1, ease: CINE, delay: 0.4 }}
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.55em] text-muted sm:text-sm"
          style={{ marginRight: '-0.55em' }}
        >
          {/* 0.35em = 0.9em (tracking inicial antigo) - 0.55em (final) */}
          <Spread text={t.hero.role} spread={0.35} play={play} transition={{ duration: 2.1, ease: CINE, delay: 0.4 }} />
        </motion.p>

        <div className="mt-12 flex w-full max-w-md flex-col items-start text-left sm:mt-14 sm:max-w-lg lg:-translate-x-[18%]">
          <motion.p {...show(0.6)} className="font-mono text-xs leading-relaxed text-muted sm:text-[13px]">
            {t.hero.tagline}
          </motion.p>
          <motion.a
            {...show(0.75)}
            href="#projects"
            // hover: no escuro o contorno e o texto ficam lima; no claro (lima sem contraste no off-white) o botão é preenchido de lima com texto em Tinta
            className="mt-8 inline-flex min-h-12 items-center border border-fg/35 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-fg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-contrast dark:hover:bg-transparent dark:hover:text-accent"
          >
            {t.hero.ctaPrimary}
          </motion.a>
        </div>
      </motion.div>

      {/* ---------- Rodapé da cena ---------- */}
      <motion.div
        {...enter(DEPTH.ui, 0.9, 1.8)}
        className="container-page absolute inset-x-0 bottom-0 z-10 flex items-center justify-between pb-[max(1.5rem,env(safe-area-inset-bottom))] font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
      >
        <nav aria-label="Social" className="-ml-3 flex items-center">
          {[
            { href: site.socials.github, label: 'GitHub', icon: <GitHubIcon />, external: true },
            { href: site.socials.linkedin, label: 'LinkedIn', icon: <LinkedInIcon />, external: true },
            { href: `mailto:${site.email}`, label: 'E-mail', icon: <Mail size={19} strokeWidth={1.75} />, external: false },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              title={s.label}
              {...(s.external && { target: '_blank', rel: 'noreferrer noopener' })}
              className="grid size-11 place-items-center rounded-full transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-accent"
            >
              {s.icon}
            </a>
          ))}
        </nav>
        <span>{t.hero.location}</span>
      </motion.div>

      <FilmLayers />
    </section>
  )
}
