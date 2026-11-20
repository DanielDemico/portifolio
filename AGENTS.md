# AGENTS.md — Portfólio

Guia para qualquer agente de IA (ou pessoa) que for trabalhar neste projeto. **Leia antes de alterar algo.**

## 1. Visão do projeto

Este é um **portfólio pessoal moderno**, com **elementos visuais interessantes**: movimento, profundidade, microinterações, tipografia forte. Ele não deve parecer um template genérico. A meta é passar profissionalismo logo no primeiro segundo, sem perder leveza nem desempenho.

O que esperamos de cada mudança:

- **Visual marcante e cinematográfico, mas com propósito.** Cena espacial com lua à contraluz, foco que sai do desfoque, grão de filme, vinheta, parallax de câmera, cards com holofote que segue o cursor, marquee. O efeito tem que servir ao conteúdo, nunca competir com ele.
- **Sem clichês de "site feito por IA"**. Estes padrões estão **proibidos** porque o dono já recusou:
  - fundo quadriculado ou em grade (`bg-grid` e similares);
  - indicador de rolagem ("Scroll", "Rolar", setinha pulando);
  - selo "Disponível para trabalho" ou "Available for new projects" com bolinha piscando;
  - degradês aleatórios cobrindo tudo, emojis como ícone, cards com borda colorida só na esquerda, "lorem ipsum".
- **Conteúdo em construção.** Quase todo texto ainda é placeholder (`[ENTRE COLCHETES]`). O site vai ser preenchido e refinado **aos poucos**. Não invente dados (anos de experiência, clientes, empresas): mantenha o placeholder até o dono informar.

## 2. Regras obrigatórias

### 2.1 Totalmente responsivo

O site precisa ficar **bonito em celular, tablet, notebook e monitores grandes**, não só "funcionar".

- Pense **mobile-first**: estilo base para o celular, depois `sm:` (640), `md:` (768), `lg:` (1024) e `xl:` (1280).
- Teste mentalmente (ou de fato) em **360 px, 390 px, 768 px, 1024 px, 1440 px e 1920 px**.
- **Nunca** pode haver rolagem horizontal na página. Gutter lateral mínimo de 16 px (`container-page` já cuida disso).
- Títulos usam `clamp()` ou escalas responsivas. Grades colapsam para 1 coluna no celular.
- Alvos de toque com **no mínimo 44×44 px**. Efeitos de hover não podem ser a única forma de acessar algo, porque no toque eles não existem.
- Use `100svh`/`100dvh` em vez de `100vh` e respeite `env(safe-area-inset-*)` (notch).

### 2.2 Idiomas (EN / PT) e tema (claro / escuro)

- **Padrão: tema CLARO + idioma INGLÊS.** A escolha do visitante fica salva no `localStorage` (`pf-theme`, `pf-lang`).
- Trocar idioma e tema precisa ser **fácil**: os dois controles ficam **sempre visíveis** no cabeçalho, também no mobile.
- **Nenhum texto visível fica fixo no componente.** Todo texto vem de `src/i18n/locales/en.ts` e `pt.ts`.
  - `en.ts` é a fonte do formato. Ao criar uma chave nele, crie a mesma em `pt.ts`, senão o TypeScript acusa erro.
  - Nos componentes: `const { t } = useI18n()`, depois `t.secao.chave`.
- **Nenhuma cor fica fixa no componente.** Use os tokens (seção 3). Todo componente novo tem que ficar correto **nos dois temas**.
- O script inline do `index.html` aplica tema e idioma **antes da primeira pintura**, para a tela não piscar. Não remova.

### 2.3 Cores da marca

As cores vêm do guia de marca no artefato de design `CsrxGifP58wyKqncAqVeha`. **Use só essa paleta** e as variações derivadas que já estão nos tokens.

| Nome | Hex | Uso |
|---|---|---|
| Roxo principal | `#6D28D9` | Cor primária, links, destaques (tema claro) |
| Roxo claro | `#8B5CF6` | Primária no tema escuro, detalhes |
| Roxo profundo | `#2E1065` | Início dos degradês, fundos de seção |
| Tinta | `#0F0B1A` | Texto e fundo escuro (substitui o preto) |
| Off-white | `#F7F5FB` | Fundo claro (substitui o branco puro) |
| Destaque (lima) | `#C6F432` | **CTAs** e pequenos detalhes. Texto sobre ele sempre em Tinta |

- Tipografia: **Sora** em títulos e display (600/700/800) e **Inter** no corpo (400/500/600). JetBrains Mono só em rótulos técnicos.
- Contraste mínimo de 4,5:1 para texto (3:1 para texto ≥ 24 px). **Nunca** use roxo sobre roxo.

### 2.4 A logo: uso único

A logo (espiral de crescentes da marca) **só aparece na Intro**. Não a use no cabeçalho, no rodapé nem em outro lugar do site. Da marca, o resto do site usa **apenas as cores**. O favicon é a única exceção técnica.

## 3. Design tokens (como usar cores)

Definidos em [src/styles/global.css](src/styles/global.css) como variáveis CSS. Elas mudam de valor com `[data-theme='dark']` e ficam disponíveis como classes do Tailwind:

| Classe | Papel |
|---|---|
| `bg-bg` | Fundo da página |
| `bg-elevated` | Cards e superfícies elevadas |
| `bg-surface` | Faixas e áreas secundárias |
| `border-border` | Bordas e divisores |
| `text-fg` | Texto principal |
| `text-muted` / `text-subtle` | Texto secundário e terciário |
| `bg-primary` / `text-primary` (+ `text-primary-contrast`) | Cor primária do tema |
| `bg-accent` + `text-accent-contrast` | CTA lima |
| `bg-brand-*` / `text-brand-*` | Cor fixa da marca, igual nos dois temas (use com cuidado) |

Utilitários próprios: `container-page`, `text-gradient`. Classes do hero: `hero-title`, `particle`, `film-vignette`, `film-grain`. Classe do céu: `hero-sky`. Tokens do hero (mudam com o tema): `--hero-sky`, `--hero-haze`, `--hero-title-glow`, `--rock-{far,near}-{top,mid,base}`, `--rock-shine`, `--rock-rim`, `--rock-rim-end`, `--particle`, `--particle-glow`, `--vignette`, `--grain-opacity`. Para a variante escura, use `dark:` (ela segue o `data-theme`, não o sistema).

## 4. A Intro

Arquivo [src/components/intro/Intro.tsx](src/components/intro/Intro.tsx) e o símbolo em [BrandMark.tsx](src/components/intro/BrandMark.tsx).

1. Um **carregamento falso** (contador `000%` → `100%` com pausas irregulares e uma barra).
2. A logo **surge peça por peça**: os 3 crescentes, de fora para dentro, cada um com contorno desenhado, depois preenchimento e rotação a partir do centro da espiral. Por último, a **esfera** aparece com efeito de mola.
3. **Logo abaixo, o nome** (`site.name`), com as letras subindo de dentro de uma máscara.
4. A tela **desliza para a esquerda** em duas camadas (o conteúdo e uma faixa roxa logo atrás) e **revela o site**, que já estava renderizado por baixo.
5. **Entrada em profundidade:** no instante em que a cortina COMEÇA a sair (`onLeave` → `revealing`), o hero e o cabeçalho entram vindo **da direita**, no mesmo sentido da cortina, como uma panorâmica de câmera. Cada camada percorre uma distância proporcional à proximidade (`DEPTH` em `Hero.tsx`): estrelas 50 px, lua 180, crista distante 260, texto 300, partículas 380, terreno 640 (com desfoque de movimento). Novas camadas do hero devem seguir essa regra: **quanto mais perto, maior a distância**.

- Duração ajustável em `site.introDurationMs` ([src/config/site.ts](src/config/site.ts)).
- A intro segue o tema: fundo claro com logo "fundo claro", fundo escuro com logo "fundo escuro".
- Tem o botão "Skip intro", trava a rolagem enquanto está na tela e é encurtada para quem prefere menos movimento (`prefers-reduced-motion`).

## 5. O Hero (cinematográfico)

Arquivos em [src/components/hero/](src/components/hero/).

**Conceito:** cena espacial em estilo "pôster de filme". Uma lua gigante serve de pano de fundo, à direita e cortada pelas bordas. O título fica centralizado com letras bem espaçadas e há duas cristas rochosas (uma distante e uma em primeiro plano). **A lua não é um objeto 3D em destaque:** ela não gira, não flutua e não fica centralizada em uma coluna.

- **O hero segue o tema**, como o resto do site (o cabeçalho também):
  - **Escuro = noite:** lua à contraluz (crescente fino à direita), estrelas, rocha escura com contorno lilás.
  - **Claro = "lua de dia":** céu lilás pálido, sem estrelas, lua quase cheia em tons pastel com limbo violeta, cristas em perspectiva atmosférica (quanto mais longe, mais próxima da cor do céu). O CTA no hover é **preenchido** de lima (texto lima sobre off-white não tem contraste).
  - Cores das camadas vêm dos tokens `--hero-*`/`--rock-*`. A base do terreno termina em `--bg`, então o hero se funde com a seção seguinte nos dois temas.
- **[MoonBackdrop.tsx](src/components/hero/MoonBackdrop.tsx):** a lua, gerada em WebGL **uma única vez** por tema (`variant="light" | "dark"`, uniform `uLight` no shader). Só redesenha quando o tamanho ou o tema mudam.
  - O canvas é 1,4× o disco, para caber o brilho.
  - Posição e tamanho ficam nas variáveis CSS `--d` (diâmetro), `--rx` (borda direita) e `--cy` (centro vertical), em `Hero.tsx`.
  - **Não** chame `loseContext()` na limpeza: no StrictMode o efeito roda duas vezes e o canvas é reaproveitado.
- **[Atmosphere.tsx](src/components/hero/Atmosphere.tsx):** estrelas, partículas roxas subindo, terreno em SVG (`layer="far" | "near"`, formatos em `RIDGES`), grão de filme e vinheta.
- **[Hero.tsx](src/components/hero/Hero.tsx):** layout e animações.
  - Título em caixa alta: as letras chegam muito afastadas e desfocadas, depois se aproximam e entram em foco.
  - Cargo em mono com espaçamento largo. Tagline em mono, um CTA retangular só com contorno (no hover, fica lima).
  - Rodapé da cena: redes sociais à esquerda, local à direita.
  - O mouse cria parallax de câmera em profundidades diferentes (estrelas < lua < crista distante < terreno).
  - Ao rolar, a lua desce devagar, o terreno sobe e o texto some.
  - Entrada: veja o item 5 da Intro (panorâmica da direita para a esquerda, com distância por profundidade).

## 6. Stack e estrutura

- **Vite + React 19 + TypeScript** (strict)
- **Tailwind CSS v4** (configurado no CSS, sem `tailwind.config`)
- **Motion** (`motion/react`, antigo Framer Motion) para animações
- **lucide-react** para ícones (sem ícones de marca: GitHub e LinkedIn entram como texto ou SVG próprio)

```
src/
  config/site.ts            # nome, links, e-mail, ordem das seções, duração da intro
  i18n/
    I18nProvider.tsx        # contexto + useI18n()
    locales/en.ts | pt.ts   # TODOS os textos
  theme/ThemeProvider.tsx   # contexto + useTheme()
  styles/global.css         # tokens, tema escuro, base, utilitários
  components/
    intro/                  # Intro + BrandMark (única ocorrência da logo)
    layout/Navbar.tsx       # cabeçalho, menu mobile, controles de idioma e tema
    hero/                   # Hero cinematográfico: Hero, MoonBackdrop (WebGL estático), Atmosphere
    sections/               # seções (About, Skills, Projects, Experience, Contact, Footer)
    ui/                     # primitivos: Reveal, SectionHeading, SpotlightCard, ButtonLink, Controls
```

### Comandos

```bash
npm install
npm run dev        # servidor local
npm run build      # checagem de tipos + build de produção
npm run preview    # serve o build
```

## 7. Convenções

- **Componentes:** funcionais, em TypeScript, com props tipadas. Um componente por responsabilidade.
- **Imports:** use o alias `@/` (equivale a `src/`).
- **Seções:** cada uma tem `id` igual à chave em `sections` (`site.ts`) e em `t.nav`. Para adicionar uma seção, inclua o id em `sections`, crie as chaves em `en.ts`/`pt.ts` e coloque o componente em `App.tsx`.
- **Animação:** prefira `Reveal` para entradas ao rolar. Use as curvas `[0.22, 1, 0.36, 1]` (saída) e `[0.76, 0, 0.24, 1]` (transições de tela). Anime `transform` e `opacity`, nunca `width`, `height` ou `top`. O `MotionConfig reducedMotion="user"` já respeita a preferência do sistema.
- **Acessibilidade:** `<button>` para ações e `<a href>` para navegação. `aria-label` em botões só com ícone. Elementos decorativos com `aria-hidden`. Foco visível (já está global).
- **Desempenho:** imagens em WebP/AVIF, com `loading="lazy"` e `width`/`height` definidos. Nada de bibliotecas pesadas sem motivo.
- **Comentários e documentação** em português. Nomes de código em inglês.

## 8. Placeholders atuais

Ainda precisam de conteúdo real (dono do projeto): nome de exibição, cargo, tagline, e-mail e redes (`site.ts`), parágrafos da história no "Sobre" (sem números ou estatísticas: o portfólio é de nível júnior), foto em resolução maior, habilidades, projetos (com imagens e links), experiências e textos de contato.
