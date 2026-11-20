/**
 * Dicionário em INGLÊS — é a "fonte da verdade" do formato.
 * Toda chave adicionada aqui DEVE existir em pt.ts (o TypeScript acusa se faltar).
 */
export const en = {
  meta: {
    title: 'Portfolio',
    description: 'Developer portfolio',
  },
  intro: {
    loading: 'Loading',
    skip: 'Skip intro',
  },
  nav: {
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'Back to top',
  },
  controls: {
    theme: 'Theme',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    language: 'Language',
    toPt: 'Mudar para português',
    toEn: 'Switch to English',
  },
  hero: {
    role: '[YOUR ROLE]',
    tagline: '[Two or three lines about what you build, how you work and why it matters. Keep it short.]',
    ctaPrimary: 'See my work',
    location: '[City] — [Country]',
  },
  about: {
    eyebrow: '01 — About',
    title: 'A little about me',
    paragraphs: [
      '[Placeholder — how you got into tech: where it started, what made you curious.]',
      '[Placeholder — what you are studying or building now, and where you want to go next.]',
    ],
    photoAlt: 'Portrait of Daniel Demico',
  },
  skills: {
    eyebrow: '02 — Skills',
    title: 'Tools & technologies',
    subtitle: '[Placeholder — the stack you use every day.]',
    groups: [
      { name: 'Frontend', items: ['[Skill]', '[Skill]', '[Skill]', '[Skill]'] },
      { name: 'Backend', items: ['[Skill]', '[Skill]', '[Skill]'] },
      { name: 'Design & Tools', items: ['[Skill]', '[Skill]', '[Skill]'] },
    ],
  },
  projects: {
    eyebrow: '03 — Projects',
    title: 'Selected work',
    subtitle: '[Placeholder — a few projects you are proud of.]',
    viewProject: 'View project',
    viewCode: 'Source code',
    items: [
      { title: '[Project name]', description: '[What it is, your role and the result.]', tags: ['[Tag]', '[Tag]'] },
      { title: '[Project name]', description: '[What it is, your role and the result.]', tags: ['[Tag]', '[Tag]'] },
      { title: '[Project name]', description: '[What it is, your role and the result.]', tags: ['[Tag]', '[Tag]'] },
    ],
  },
  experience: {
    eyebrow: '04 — Experience',
    title: 'Where I have worked',
    items: [
      { period: '[Year] — Present', role: '[Role]', company: '[Company]', description: '[What you did there.]' },
      { period: '[Year] — [Year]', role: '[Role]', company: '[Company]', description: '[What you did there.]' },
    ],
  },
  contact: {
    eyebrow: '05 — Contact',
    title: "TESTE CI/CD 2",
    body: '[Placeholder — an invitation to get in touch.]',
    cta: 'Send an email',
  },
  footer: {
    rights: 'All rights reserved.',
    made: 'Designed & built with care.',
  },
}

/** Formato do dicionário com valores `string` genéricos (não os literais do inglês). */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> }

export type Dictionary = Widen<typeof en>
