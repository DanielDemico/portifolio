import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Dictionary } from './locales/en'
import { pt } from './locales/pt'
import { readStorage, writeStorage } from '@/lib/storage'

export type Lang = 'en' | 'pt'

const dictionaries: Record<Lang, Dictionary> = { en, pt }
const STORAGE_KEY = 'pf-lang'
const DEFAULT_LANG: Lang = 'en' // padrão do projeto: inglês

type I18nContextValue = {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function initialLang(): Lang {
  const saved = readStorage(STORAGE_KEY)
  return saved === 'pt' || saved === 'en' ? saved : DEFAULT_LANG
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    const t = dictionaries[lang]
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    writeStorage(STORAGE_KEY, next)
  }, [])

  const toggleLang = useCallback(() => setLang(lang === 'en' ? 'pt' : 'en'), [lang, setLang])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang, toggleLang }), [lang, setLang, toggleLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** `const { t, lang, toggleLang } = useI18n()` → `t.hero.greeting` */
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
