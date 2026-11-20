import type { Dictionary } from './en'

/** Dicionário em PORTUGUÊS — mesmo formato do en.ts. */
export const pt: Dictionary = {
  meta: {
    title: 'Portfólio',
    description: 'Portfólio de desenvolvedor',
  },
  intro: {
    loading: 'Carregando',
    skip: 'Pular introdução',
  },
  nav: {
    about: 'Sobre',
    skills: 'Habilidades',
    projects: 'Projetos',
    experience: 'Experiência',
    contact: 'Contato',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    home: 'Voltar ao topo',
  },
  controls: {
    theme: 'Tema',
    toLight: 'Mudar para modo claro',
    toDark: 'Mudar para modo escuro',
    language: 'Idioma',
    toPt: 'Mudar para português',
    toEn: 'Switch to English',
  },
  hero: {
    role: '[SEU CARGO]',
    tagline: '[Duas ou três linhas sobre o que você constrói, como trabalha e por que importa. Seja breve.]',
    ctaPrimary: 'Ver meu trabalho',
    location: '[Cidade] — [País]',
  },
  about: {
    eyebrow: '01 — Sobre',
    title: 'Um pouco sobre mim',
    paragraphs: [
      '[Placeholder — como você entrou na tecnologia: onde começou, o que despertou sua curiosidade.]',
      '[Placeholder — o que você está estudando ou construindo agora e aonde quer chegar.]',
    ],
    photoAlt: 'Foto de Daniel Demico',
  },
  skills: {
    eyebrow: '02 — Habilidades',
    title: 'Ferramentas e tecnologias',
    subtitle: '[Placeholder — a stack que você usa no dia a dia.]',
    groups: [
      { name: 'Frontend', items: ['[Skill]', '[Skill]', '[Skill]', '[Skill]'] },
      { name: 'Backend', items: ['[Skill]', '[Skill]', '[Skill]'] },
      { name: 'Design e Ferramentas', items: ['[Skill]', '[Skill]', '[Skill]'] },
    ],
  },
  projects: {
    eyebrow: '03 — Projetos',
    title: 'Trabalhos selecionados',
    subtitle: '[Placeholder — alguns projetos dos quais você se orgulha.]',
    viewProject: 'Ver projeto',
    viewCode: 'Código-fonte',
    items: [
      { title: '[Nome do projeto]', description: '[O que é, seu papel e o resultado.]', tags: ['[Tag]', '[Tag]'] },
      { title: '[Nome do projeto]', description: '[O que é, seu papel e o resultado.]', tags: ['[Tag]', '[Tag]'] },
      { title: '[Nome do projeto]', description: '[O que é, seu papel e o resultado.]', tags: ['[Tag]', '[Tag]'] },
    ],
  },
  experience: {
    eyebrow: '04 — Experiência',
    title: 'Onde já trabalhei',
    items: [
      { period: '[Ano] — Atual', role: '[Cargo]', company: '[Empresa]', description: '[O que você fez lá.]' },
      { period: '[Ano] — [Ano]', role: '[Cargo]', company: '[Empresa]', description: '[O que você fez lá.]' },
    ],
  },
  contact: {
    eyebrow: '05 — Contato',
    title: 'Vamos construir algo juntos',
    body: '[Placeholder — um convite para entrar em contato.]',
    cta: 'Enviar um e-mail',
  },
  footer: {
    rights: 'Todos os direitos reservados.',
    made: 'Desenhado e construído com cuidado.',
  },
}
