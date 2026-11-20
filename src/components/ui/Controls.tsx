import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/theme/ThemeProvider'
import { useI18n, type Lang } from '@/i18n/I18nProvider'

/** Botão de tema (claro ↔ escuro), com o ícone girando na troca. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t.controls.toLight : t.controls.toDark}
      title={isDark ? t.controls.toLight : t.controls.toDark}
      className="relative grid size-11 place-items-center overflow-hidden rounded-full border border-border bg-elevated text-fg transition-colors hover:border-primary hover:text-primary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

const LANGS: Lang[] = ['en', 'pt']

/** Seletor EN | PT em pílula, com indicador deslizante. */
export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t.controls.language}
      className="relative flex h-11 items-center rounded-full border border-border bg-elevated p-1"
    >
      {LANGS.map((l) => {
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={l === 'pt' ? t.controls.toPt : t.controls.toEn}
            className={`relative z-10 h-full min-w-10 rounded-full px-2.5 font-mono text-xs font-medium uppercase transition-colors ${
              active ? 'text-primary-contrast' : 'text-muted hover:text-fg'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {l}
          </button>
        )
      })}
    </div>
  )
}
