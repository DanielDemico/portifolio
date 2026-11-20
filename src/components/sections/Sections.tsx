import { ArrowUpRight, Code, Mail } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { site } from '@/config/site'
import { ButtonLink, Reveal, SectionHeading, SpotlightCard } from '@/components/ui/primitives'

/*
 * PLACEHOLDERS das seções do portfólio. Todo texto vem de src/i18n/locales.
 * Cada seção será refinada aos poucos — mantenha os ids (âncoras do menu).
 */

/* ---------------------------------- Marquee ---------------------------------- */
export function Marquee() {
  const { t } = useI18n()
  const words = t.skills.groups.flatMap((g) => [g.name, ...g.items])
  const row = [...words, ...words]

  return (
    <div aria-hidden className="relative overflow-hidden border-y border-border bg-surface py-5">
      {/* animate-marquee: keyframes em CSS (global.css), roda no compositor */}
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl font-bold text-subtle sm:text-3xl">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------- About ----------------------------------- */
export function About() {
  const { t } = useI18n()
  return (
    <section id="about" className="container-page py-20 sm:py-28">
      <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        {/* Foto (public/eu_linkedin.jpg — 200×200; troque por uma maior, ≥ 640px, para ficar nítida) */}
        <Reveal className="group relative mx-auto aspect-square w-full max-w-[17rem] sm:max-w-[19rem] lg:mx-0 lg:justify-self-center">
          <div className="absolute inset-0 rotate-[5deg] rounded-[2rem] bg-gradient-to-br from-brand-purple-deep via-brand-purple to-brand-purple-light transition-transform duration-500 group-hover:rotate-[8deg]" />
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border bg-elevated">
            <img
              src="/eu_linkedin.jpg"
              alt={t.about.photoAlt}
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Reveal>

        <div className="flex max-w-2xl flex-col justify-center gap-5">
          {t.about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-base text-muted sm:text-lg">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------- Skills ---------------------------------- */
export function Skills() {
  const { t } = useI18n()
  return (
    <section id="skills" className="container-page py-20 sm:py-28">
      <SectionHeading eyebrow={t.skills.eyebrow} title={t.skills.title} subtitle={t.skills.subtitle} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.skills.groups.map((g, i) => (
          <Reveal key={g.name} delay={i * 0.08}>
            <SpotlightCard className="h-full p-6 sm:p-8">
              <h3 className="text-xl font-bold text-fg">{g.name}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((s, j) => (
                  <li key={j} className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------- Projects --------------------------------- */
export function Projects() {
  const { t } = useI18n()
  return (
    <section id="projects" className="container-page py-20 sm:py-28">
      <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} subtitle={t.projects.subtitle} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {t.projects.items.map((p, i) => (
          <Reveal key={i} delay={i * 0.08} className={i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}>
            <SpotlightCard className="flex h-full flex-col">
              {/* Placeholder de imagem do projeto */}
              <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface">
                <div
                  className="absolute -bottom-1/3 left-1/2 size-2/3 -translate-x-1/2 rounded-full transition-transform duration-500 group-hover:scale-125"
                  style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
                />
                <span className="absolute inset-0 grid place-items-center font-mono text-xs text-subtle">[PROJECT IMAGE]</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-fg">{p.title}</h3>
                <p className="mt-2 flex-1 text-muted">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((tag, j) => (
                    <li key={j} className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary">
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                  <a href="#" className="inline-flex min-h-11 items-center gap-1 text-fg hover:text-primary">
                    {t.projects.viewProject} <ArrowUpRight size={16} />
                  </a>
                  <a href="#" className="inline-flex min-h-11 items-center gap-1 text-muted hover:text-primary">
                    <Code size={16} /> {t.projects.viewCode}
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------- Experience -------------------------------- */
export function Experience() {
  const { t } = useI18n()
  return (
    <section id="experience" className="container-page py-20 sm:py-28">
      <SectionHeading eyebrow={t.experience.eyebrow} title={t.experience.title} />
      <ol className="relative ml-2 border-l border-border sm:ml-4">
        {t.experience.items.map((e, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <li className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
              <span className="absolute -left-[7px] top-1.5 size-3.5 rounded-full border-2 border-bg bg-primary ring-4 ring-primary/15" />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{e.period}</p>
              <h3 className="mt-2 text-xl font-bold text-fg sm:text-2xl">
                {e.role} <span className="text-muted">· {e.company}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-muted">{e.description}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ---------------------------------- Contact ---------------------------------- */
export function Contact() {
  const { t } = useI18n()
  return (
    <section id="contact" className="container-page py-20 sm:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-purple-deep px-6 py-16 text-center sm:px-12 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand-purple opacity-60 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full bg-brand-purple-light opacity-30 blur-3xl" />
          <div className="relative">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-brand-accent">{t.contact.eyebrow}</p>
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold text-brand-offwhite sm:text-5xl">{t.contact.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-[#C4B5FD]">{t.contact.body}</p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href={`mailto:${site.email}`}>
                <Mail size={16} /> {t.contact.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ----------------------------------- Footer ---------------------------------- */
export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-subtle sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}. {t.footer.rights}
        </p>
        <div className="flex items-center gap-5">
          <a href={site.socials.github} target="_blank" rel="noreferrer" className="hover:text-primary">
            GitHub
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary">
            LinkedIn
          </a>
          <span className="hidden md:inline">{t.footer.made}</span>
        </div>
      </div>
    </footer>
  )
}
