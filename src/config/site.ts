/**
 * Dados pessoais e links do portfólio.
 * Textos traduzíveis ficam em src/i18n/locales — aqui só o que NÃO muda com o idioma.
 */
export const site = {
  name: 'Daniel Demico', // TODO: confirmar nome de exibição
  initials: 'DD',
  email: '[YOUR EMAIL]',
  socials: {
    github: 'https://github.com/[YOUR-USER]',
    linkedin: 'https://www.linkedin.com/in/[YOUR-USER]',
  },
  /** Duração total aproximada da intro (ms). Ajuste aqui. */
  introDurationMs: 3200,
} as const

/** Seções do site, na ordem do menu. `id` = âncora e chave de tradução em nav.* */
export const sections = ['about', 'skills', 'projects', 'experience', 'contact'] as const
export type SectionId = (typeof sections)[number]
