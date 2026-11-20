import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { sections, site } from '@/config/site'
import { LanguageToggle, ThemeToggle } from '@/components/ui/Controls'

/**
 * Cabeçalho fixo. Fica "vidro fosco" ao rolar.
 * Idioma e tema ficam SEMPRE visíveis (também no mobile) — trocar deve ser fácil.
 */
/** `play`: a intro começou a sair → o cabeçalho entra da direita, no mesmo sentido da cortina. */
export function Navbar({ play = true }: { play?: boolean }) {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 12)
  })

  // Fecha o menu mobile ao passar para desktop / Esc
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 768px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    // O hero segue o tema, então o cabeçalho também segue o tema o tempo todo.
    <header
      className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
    >
      <div
        // blur menor = backdrop-filter bem mais barato (é refeito sempre que o fundo muda)
        className={`transition-[background-color,border-color] duration-300 ${
          scrolled || open ? 'border-b border-border bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <motion.nav
          initial={{ opacity: 0, x: 160 }}
          animate={play ? { opacity: 1, x: 0 } : undefined}
          transition={{ x: { duration: 1.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }, opacity: { duration: 0.6, delay: 0.2 } }}
          className="container-page flex h-16 items-center justify-between gap-3 sm:h-20"
        >
          <a
            href="#top"
            aria-label={t.nav.home}
            className="group flex items-center gap-2 font-display text-lg font-bold tracking-wide text-fg"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm text-primary-contrast transition-transform group-hover:rotate-[-8deg]">
              {site.initials}
            </span>
            <span className="hidden sm:inline">{site.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-fg lg:px-4"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="grid size-11 place-items-center rounded-full border border-border bg-elevated text-fg md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.nav>

        {/* Barra de progresso de leitura */}
        <motion.div className="h-px origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="h-[calc(100dvh-4rem)] overflow-y-auto bg-bg md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-6">
              {sections.map((id, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-border py-4 font-display text-3xl font-bold text-fg"
                  >
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    {t.nav[id]}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
