---
name: Xat — Design Engineer Portfolio
description: A trilingual personal site for a design engineer — built like the work it presents.
colors:
  # ─── Brand identity (carries voice; used sparingly) ───
  highlight-text: "oklch(0.673 0.117 3)"
  highlight-text-dark: "oklch(0.84 0.08 58)"
  highlight-soft: "oklch(0.857 0.061 11)"
  highlight-soft-dark: "oklch(0.72 0.018 20)"
  selection: "oklch(0.88 0.018 92)"

  # ─── Surface (page canvas + raised layers) ───
  background: "oklch(1 0 0)"
  background-dark: "oklch(0.145 0.004 260)"
  surface: "oklch(1 0 0)"
  surface-dark: "oklch(0.19 0.005 260)"
  popover: "oklch(1 0 0)"
  popover-dark: "oklch(0.19 0.005 260)"
  sidebar-dark: "oklch(0.115 0.004 260)"

  # ─── Content (ink hierarchy) ───
  foreground: "oklch(0.17 0.003 260)"
  foreground-dark: "oklch(0.965 0.006 260)"
  muted-foreground: "oklch(0.45 0.004 260)"
  muted-foreground-dark: "oklch(0.68 0.006 260)"

  # ─── Wash & edges (structure, hover state) ───
  muted: "oklch(0 0 0 / 0.04)"
  muted-dark: "oklch(0.965 0.006 260 / 0.06)"
  border: "oklch(0 0 0 / 0.08)"
  border-dark: "oklch(0.965 0.006 260 / 0.15)"
  input: "oklch(0 0 0 / 0.10)"
  input-dark: "oklch(0.965 0.006 260 / 0.18)"
  ring: "oklch(0.708 0 0)"
  ring-dark: "oklch(0.556 0 0)"

  # ─── Code surface (a single dark Vesper canvas in BOTH modes) ───
  code: "oklch(0.206 0.012 278)"
  code-foreground: "oklch(0.961 0 0)"

  # ─── Status (semantic, imported from Tailwind v4 scale) ───
  destructive: "oklch(0.56 0.19 28)"
  info: "oklch(0.623 0.214 260)"
  success: "oklch(0.696 0.17 162)"
  warning: "oklch(0.769 0.188 70)"

typography:
  display:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0"
  headline:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0"
  title:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  body:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0"
  label:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0"
  mono:
    fontFamily: "'Calling Code', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  bio-lead:
    fontFamily: "'Source Han Serif SC Subset', 'New York', 'Iowan Old Style', Baskerville, 'Times New Roman', Georgia, 'Noto Serif SC', 'Hiragino Mincho ProN', ui-serif, serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.75
    letterSpacing: "0"
  wordmark:
    fontFamily: "'Fugaz One', 'Hanken Grotesk', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0"

rounded:
  xs: "2px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"

spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "5rem"
  section-gap: "7rem"
  page-shell-y: "3.5rem"
  container-max: "42rem"

components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "2.25rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "oklch(0.17 0.003 260 / 0.9)"
    textColor: "{colors.background}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "2.25rem"
    typography: "{typography.label}"
  button-outline-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "2.25rem"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
  badge-default:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
    typography: "{typography.mono}"
  badge-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
    typography: "{typography.mono}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  intro-badge:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.highlight-text}"
    rounded: "{rounded.md}"
    padding: "0.16em 0.35em"
    typography: "{typography.label}"
  intro-badge-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.highlight-text}"
---

<!--
DESIGN.md follows the Google Stitch DESIGN.md format (six sections, fixed order).
Tokens above are normative; the prose below contextualizes how to apply them.
A machine-readable sidecar lives at `.impeccable/design.json` (tonal ramps, shadows,
motion, component HTML/CSS, narrative).
-->

# Design System: Xat — Design Engineer Portfolio

## 1. Overview

**Creative North Star: "Cute with Shiny Elegance."**

The system is engineering precision wearing a soft glow. The bones are an austere mono-ink grid — paper-white in light, deep blue-tinted ink in dark — held together by hairlines, not boxes. The accent is **Quiet Rose** in light mode and **Warm Apricot** in dark, used on no more than ~10% of any screen: the wordmark, link affordances, an icon tint, a hover halo around a card. The accent is the brand's voice; its rarity is what makes it land.

The "Cute" lives in specific, named places — never as ambient decoration. A `Fugaz One` wordmark used only for the three letters "Xat". A coin-flip mascot on the design page. A `wanderer` gradient text in the footer that animates rose to cyan as a metaphor for the visitor's geographic journey to this site. The "Shiny" is the soft pink halo (`highlight-soft`) that appears under interactive surfaces on hover. The "Elegance" is the trilingual typography stack — Hanken Grotesk for Latin, MiSans for CJK content, a tiny Source Han Serif subset for the bio lead — tuned with per-locale `text-wrap`, `line-break`, and `hyphens` rules so Chinese, Japanese, and English each break the way their typography traditions expect.

The system explicitly rejects: corporate SaaS chrome, brutalist heaviness, templated icon-title-card grids, neon-on-black AI tooling tropes, and editorial-magazine pastiche (no Fraunces, no italic drop caps, no broadsheet columns). It is **not** "premium-minimal" in the lazy lifestyle-brand sense — it earns minimalism through restraint plus one or two committed, named decisions per surface.

**Key Characteristics:**
- **Mono-ink + one accent.** Restrained color strategy. The accent appears on ≤10% of any screen and means *something*: identity, link, emphasis, or interaction state.
- **Hairlines over fills.** Structure is carried by 1px borders at 8–15% opacity, not by background colors or shadows.
- **Whisper shadows, never elevation.** The system ships one shadow token (`shadow-halo`) tinted with the brand color at 30% opacity. Hover deepens to 45% via color override, never new geometry. The shadow suggests a halo, not lift.
- **Trilingual-first typography.** Every paragraph, heading, and label has explicit `lang`-aware breaking rules. Latin balances, CJK wraps, Japanese line-breaks strict.
- **Reveal on entry.** Page-load and scroll-driven blur-in (10px → 0, opacity 0 → 1, 420ms `cubic-bezier(0.22, 1, 0.36, 1)`). Staggered children are how content arrives; static is how content rests.
- **Single-column narrow.** Max width 42rem (`max-w-2xl`). Pages are scrolled essays, not dashboards.
- **OKLCH everywhere.** All color tokens live in OKLCH. No hex in source. No `#000` or `#fff` in implementation (the one exception — `oklch(1 0 0)` as light-mode background — is documented in Do's & Don'ts).

## 2. Colors

A near-monochromatic ink palette held warm by a single rose-family accent. Light mode reads as paper; dark mode reads as deep ink with the accent shifting from rose to apricot to stay visible against the dark canvas.

### Primary

- **Quiet Rose** (light: `oklch(0.673 0.117 3)`): The brand voice in light mode. Used on the `Xat` wordmark, link affordances (`.text-link`), emphasized text (`text-highlight-strong`), and interactive icon tints (`text-highlight-icon`). The hue (~3°) is a desaturated red sitting at the rose/coral border. Never used as a solid block fill.
- **Warm Apricot** (dark: `oklch(0.84 0.08 58)`): The same role in dark mode, shifted to ~58° (amber) so it reads warm against deep ink without losing identity. The shift is deliberate — straight rose at dark luminance reads muddy.

### Secondary

- **Petal Wash — light** (`oklch(0.857 0.061 11)`) / **dark** (`oklch(0.72 0.018 20)`): The halo color (`highlight-soft`). Lives in `box-shadow`, soft borders on interactive surfaces, and the rounded link underlines. Never a text color, never a fill.
- **Selection Honey** (`oklch(0.88 0.018 92)`): Text selection color. Warm yellow tint, distinct from the accent so highlighted text doesn't read as a link.

### Neutral

- **Soft Ink** (light foreground: `oklch(0.17 0.003 260)`) / **Soft Snow** (dark foreground: `oklch(0.965 0.006 260)`): Primary body and heading color. Tinted ~260° (blue-violet) at chroma 0.003–0.006 — never pure black or pure white in spirit, even if light-mode background renders as `oklch(1 0 0)`.
- **Whisper Ink** (light muted-foreground: `oklch(0.45 0.004 260)`) / **Dust Snow** (dark: `oklch(0.68 0.006 260)`): Secondary copy. Bio descriptions, eyebrow numbers, captions.
- **Paper / Ink** (background: light `oklch(1 0 0)`, dark `oklch(0.145 0.004 260)`): The page canvas. Light reads as paper-clean; dark is near-black with a whisper of blue-violet.
- **Riser** (surface / card / popover, dark only: `oklch(0.19 0.005 260)`): A single raised step above ink. In light mode there is no riser — `surface`, `card`, and `popover` all collapse to `background` and are separated by border instead of fill.
- **Hairline** (border: light `oklch(0 0 0 / 0.08)` / dark `oklch(0.965 0.006 260 / 0.15)`): All structural separation. 1px, alpha-mixed against the surface so it never reads as a line painted on top.

### Tertiary

- **Status colors** — `destructive`, `info`, `success`, `warning` — are imported from Tailwind v4's palette (red-500, blue-500, emerald-500, amber-500). They are functional, not brand. Use them for system feedback only.
- **Code Vesper** (`oklch(0.206 0.012 278)`): The code-block background. Stays dark in BOTH light and dark site modes — code surfaces never switch palette. The Vesper syntax theme expects this canvas.

### Named Rules

**The One Voice Rule.** `highlight-text` and `highlight-soft` together occupy ≤10% of any rendered screen. The accent's rarity is the point. If a screen feels "too pink", remove a use, don't desaturate the color.

**The Hairlines-Not-Walls Rule.** In light mode, `surface`, `card`, and `popover` all collapse to the same value as `background`. Cards exist as bordered regions, not filled regions. In dark mode, a single 0.045-luminance step lifts them. Never stack more than one elevation step.

**The Selection Is Not the Link Rule.** Selection color is warm yellow (`Selection Honey`), not the rose accent, so a selected paragraph never reads as a hyperlink mid-read.

**The Code Stays Dark Rule.** `--code` and `--code-foreground` are identical in light and dark modes. Vesper is the code identity; the site theme stops at the code-block frame.

## 3. Typography

**Display Font:** Hanken Grotesk (variable, 100–900, roman + italic). Self-hosted; matched with a Latin-only fallback (`Hanken Grotesk Fallback`) that retunes `.AppleSystemUIFont` metrics so `font-display: swap` never resizes UI strings before the real face arrives.

**Body Font:** Hanken Grotesk for Latin / **MiSans VF** for CJK content (auto-fallback via `vite-plugin-font`).

**Wordmark Font:** Fugaz One (subset). Used **only** for the three letters "Xat" — wordmark identity, never anywhere else.

**Bio-Lead Font:** Source Han Serif SC Subset (semibold). A hand-subsetted woff2 containing exactly the glyphs used in the home page bio lead across en/zh/ja. Adding new copy that uses `font-serif` requires regenerating the subset — that constraint is the cost of the subset's tiny size.

**Code Font:** Calling Code (regular, bold, italic). A humanist mono with distinctive italic.

**Character:** A trilingual specimen sheet for a quiet engineering practice. Latin reads as crisp, geometric, slightly mechanical. CJK reads as modern-publishing grade — never default system fallback. The single Fugaz One wordmark is the system's permitted bit of "cute".

### Hierarchy

- **Display** (Hanken Grotesk, 500, 30px / 1.1, `text-3xl`): Page H1s. The home page name "Xat", the design page eyebrow, the post title.
- **Headline** (Hanken Grotesk, 500, 24px / 1.25, `text-2xl`): Section H2s. "Writing", "Capabilities", "Colors", "Typography".
- **Title** (Hanken Grotesk, 600, 18px / 1.4, `text-lg/6`): Subsection H3s. Capability item titles, color group titles.
- **Body** (Hanken Grotesk + MiSans, 400, 16px / 28px, `text-base/7`): Paragraphs, bio copy, descriptions. Max ~65ch via `max-w-prose`.
- **Label** (Hanken Grotesk, 500, 14px / 1.25, `text-sm font-medium`): Eyebrow labels, button text, badge text.
- **Mono** (Calling Code, 400, 12px / 1.5, `text-xs font-mono`): Capability numbers (`01`, `02`), code references inline, color value readouts, theme-class names on the design page.
- **Bio-Lead** (Source Han Serif SC Subset, 600, 16px / 28px): The home page lead line `Building production-quality interfaces and AI-native products` / `打造生产级界面与 AI 原生产品` / `本番品質の UI と AI ネイティブなプロダクトをつくる`. The only place the system uses serif.
- **Wordmark** (Fugaz One, 400, 24–30px / 1): The string "Xat", colored `text-highlight-strong`. The system's single brand mark.

### Named Rules

**The Trilingual Wrap Rule.** Every block of body copy has explicit per-locale text breaking: Latin uses `text-wrap: pretty` and `hyphens: manual`; CJK uses `hyphens: none` and `text-wrap: wrap`; Japanese paragraphs additionally use `line-break: strict` (JLREQ). Japanese headings drop `text-wrap: balance` and use plain `wrap` because balance reflows CJK titles awkwardly.

**The One Wordmark Rule.** `font-fugaz-one` is forbidden anywhere except on the literal text "Xat". The brand mark is a wordmark, not a font choice.

**The One Gradient Rule.** `background-clip: text` combined with a gradient background appears in **exactly one** place: the footer `wanderer-gradient-text` animation. Its role is metaphorical — the visitor's geographic journey to this site. Decorative gradient text is forbidden everywhere else in the system.

**The Serif Subset Discipline.** New copy that uses `font-serif` requires regenerating the `source-han-serif-sc-semibold-subset.woff2` to include the new glyphs. Skipping this falls through to system serifs character by character and looks broken. If you can't regenerate the subset, don't use `font-serif`.

## 4. Elevation

**The system is flat by default.** Cards, popovers, and surfaces sit on the page; they do not float above it. Depth is conveyed by hairline border (1px at 8–15% opacity) and by a single 0.045-luminance step in dark mode (`surface` = `oklch(0.19)` vs. `background` = `oklch(0.145)`).

Shadows exist, but they are **whispers** — pink/rose-tinted at low opacity, suggesting a halo around interactive elements rather than physical lift. The system ships one shadow primitive:

### Shadow Vocabulary

- **shadow-halo** (`0 1px 2px 0 var(--tw-shadow-color, color-mix(in srgb, var(--color-highlight-soft) 30%, transparent))`): The single signature shadow. 1–2px geometry, rose-tinted by default, used by `highlight-surface` (cards, intro badges, popovers) and `.surface-callout` (asides). Color is intentionally indirected through `--tw-shadow-color` so utility overrides (`dark:shadow-black/35`, `hover:shadow-highlight-soft/45`) recolor the same geometry without redefining it.

Hover state shadows are recolored, not enlarged. `highlight-surface-hover` shifts the `box-shadow` color from `highlight-soft/30` to `highlight-soft/45` without changing the geometry — the surface "warms up" rather than "lifts up".

### Named Rules

**The Whisper-Only Rule.** Every shadow in the system is tinted with `highlight-soft` at <50% opacity. Pure black `rgba(0,0,0,X)` shadows are forbidden in light mode — they read as cheap, generic. Dark-mode shadows fall back to `black/35–40` because tinted shadows wash out against dark surfaces.

**The Border-First Rule.** When you reach for a shadow to separate a surface from its background, try a hairline border first. Shadow is for state (hover, focus, halo), border is for structure.

**The No-Glass Rule.** No `backdrop-filter: blur()` as a decorative layer. The one exception is the code-block copy button's 2px backdrop blur, which is a functional readability fix on top of dark code surfaces, not a glassmorphism aesthetic.

## 5. Components

Every component starts as a bejamas prime (`src/components/ui/<name>/`); custom compositions live in `src/components/` and wrap primes rather than modifying them. The visual language across all of them is: rounded-md to rounded-xl, 1px hairline borders, restrained transitions (150ms ease-out), `active:scale-98` press feedback, focus-ring at `ring/50` opacity.

### Buttons

- **Shape:** Rounded medium (`var(--radius-md)` = 8px); small variant uses `min(--radius-md, 10px)`; large variant uses `rounded-lg` (10px).
- **Primary (default):** Solid `foreground` ink on `background`. The role is "carry the mono-ink identity" — black on white in light, white on near-black in dark. Hover dims to 80–90% opacity. Press scales to 0.98.
- **Outline:** `background` fill, hairline border, `foreground` text. Hover fills with `muted` (4% black wash). The workhorse variant.
- **Ghost:** Transparent, hover fills with `muted`. For low-emphasis actions in dense regions.
- **Secondary:** `secondary` fill (4% black alpha), `secondary-foreground` ink. Quiet alternative to outline.
- **Link:** No padding, `text-primary`, underline on hover. Reserved for inline destinations inside button-shaped slots.
- **Destructive:** `destructive/10` fill, `destructive` text. Soft, never loud — destructive actions are explained, not screamed.
- **Focus:** 3px ring at `ring/50` opacity, plus 1px border shift to `ring`. Visible on `:focus-visible` only.
- **Press:** `active:scale-98`. Subtle scale, not bounce.

### Badges

- **Shape:** Two shapes only. `rounded-xs` (2px) for tag-style chips; `rounded-full` for pill-style. The site's wrapper applies `rounded-full` as the default.
- **Variants:** `default` (solid ink), `secondary` (4% wash), `outline` (hairline border only), `destructive` (`destructive/10` fill).
- **Sizes:** Default 24px tall (`h-6 text-sm`); small 20px tall (`h-5 text-xs`).
- **Numeric pills:** Small round monospace badges (`h-5 min-w-5 rounded-full font-mono tabular-nums`) for counts.

### Cards

- **Corner Style:** `rounded-xl` (14px).
- **Background:** `card` (= `background` in light, `surface` in dark).
- **Border:** 1px `border` ALWAYS. Never borderless.
- **Shadow:** `shadow-sm ring-1 ring-foreground/10` — a near-imperceptible halo, not lift. The ring carries most of the perceived edge.
- **Internal Padding:** `py-6` (24px vertical); content rows space themselves with `gap-6`.
- **Media:** Top/bottom edges of media children are clipped to the card radius (`*:[img:first-child]:rounded-t-xl`).

### Surfaces (the signature pattern)

A custom utility set, `.highlight-surface` / `.highlight-surface-hover` / `.highlight-surface-active`, is the visual signature of the entire portfolio:

- **Base:** `border border-highlight-soft/75 shadow-halo` in light mode; `border-border shadow-black/35` in dark.
- **Hover:** `border-highlight-soft shadow-highlight-soft/45` in light; `border-foreground/22` in dark.
- **Active/open:** `border-highlight-soft bg-accent/50 shadow-highlight-soft/45`.

This is what gives the inline intro badges, the home-page entry cards, and the popovers their "Cute with Shiny" quality — a pink halo that brightens on interaction. It is the single most reused signature pattern; use it any time an interactive surface needs to feel touchable.

### Pill Underline Links

- **Style:** Not a `text-decoration: underline`. Two radial-gradient circles at the line endpoints plus a horizontal bar between them, drawn via `background-image` and clipped per-line with `box-decoration-break: clone`. Result: a soft pill underline at line-ends that survives line-wrapping cleanly.
- **Color:** `--text-link-underline` defaults to a mix of `highlight-soft 75%` + `background`. On hover, lifts to full `highlight-soft`.
- **Three variants:** `.text-link` (default, accent text + underline), `.text-link-muted` (muted text, accent on hover — used for locale switcher), `.article-body a` (same as `.text-link` but scoped to MDX content).

### Popovers / Hover Cards

- **Shape:** `rounded-md` (8px).
- **Background:** `popover` token (white in light, riser-ink in dark).
- **Border:** 1px `border` (8% black alpha).
- **Shadow:** `0 14px 36px -24px` rose-tinted.
- **Typography:** 14px / 1.35, `font-ui` (Hanken Grotesk).
- **Usage:** Site uses one custom-scrollbar tooltip and a HoverCard-backed "intro badge" popover that fires on hover/focus over inline tokens like "design engineer" and "product designer".

### Intro Badge (signature inline component)

A composed component that wraps the bejamas `Button` (variant `outline`) inside a `HoverCard`. Visually it reads as a highlight-tinted inline token within prose: `padding: 0.16em 0.35em`, `rounded-md`, `text-highlight-strong`, with the full `highlight-surface` halo stack. On open, it locks into the active state. This is the system's solution for "explain a term inline without leaving the paragraph".

### Eyebrow

- **Style:** Section label component (`Eyebrow as="h2"`). `font-ui text-base font-medium text-foreground`. No uppercase, no tracking, no decoration — just a small bold sans label.
- **Pairing:** Often appears as the left column of a 2-column `sm:grid-cols-[10rem_1fr]` layout next to a `text-muted-foreground` description.

### Navigation

- **Header:** Locale switcher + theme switcher, baseline-aligned, justified across the page top. No global nav bar — this is a personal site, not an app.
- **Footer:** Wanderer gradient text + footer nav + version + ICP filing. The wanderer line is the only animated element.
- **Locale switcher:** Three `text-link-muted` text buttons separated by a divider. Active locale is `text-highlight-strong`. No flags inside the switcher (flags belong to the visitor-geo line in the footer).
- **Theme switcher:** Three buttons (Light / Dark / System) in a pill row.

### Reveal & Stagger (the entrance language)

Animations live in `src/lib/reveal-engine.ts`. Two primitives:

- **`<Reveal>`**: A single element fades from `opacity: 0, filter: blur(10px)` to `opacity: 1, filter: none` over 420ms `cubic-bezier(0.22, 1, 0.36, 1)`. Scroll-triggered for below-fold content via `IntersectionObserver`.
- **`<StaggerReveal>`**: Same animation applied to children with a 48ms stagger (with a 60ms base delay).

Both honor `prefers-reduced-motion: reduce` (animations disabled, opacity instantly 1).

Article bodies use a similar but separate `article-line-reveal` keyframe for paragraph-by-paragraph entry on post pages.

### Wanderer Gradient Text (the system's one moving thing)

Footer-only signature. A `background-clip: text` gradient that animates `background-position: 0% 50%` → `100% 50%` over 7.5s `cubic-bezier(0.45, 0, 0.2, 1)`, alternating. The gradient runs `highlight-text → mix(highlight-text, foreground) → cyan-600 → mix(foreground, highlight-text) → highlight-text` in light mode; brighter cyan-300 in dark. Reduced motion freezes it at 50%. This is the only animated text and the only gradient text in the entire system.

## 6. Do's and Don'ts

### Do:

- **Do** keep `highlight-text` and `highlight-soft` together below ~10% of any rendered screen. Their rarity is what makes them read as identity.
- **Do** use OKLCH for every color token. No hex in source. No `rgb()` either.
- **Do** tint shadows with `highlight-soft` in light mode. Pure-black shadows read as cheap.
- **Do** carry structure with hairline borders (1px at 8–15% opacity), not background fills.
- **Do** use `text-wrap: balance` on Latin headings and `text-wrap: wrap` on Japanese headings. The site has explicit per-locale rules; don't bypass them with utility classes.
- **Do** wrap any new prime-component customization in `src/components/`, not by editing files in `src/components/ui/`. The prime directory is a mirror of the bejamas registry.
- **Do** use `transition-colors duration-150 ease-out` as the default transition. The whole system breathes at the same tempo.
- **Do** start every motion with `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart). It's the system's canonical curve.
- **Do** scope new client JS to `<script>` tags or imports from `src/lib/*-client.ts`. Astro islands are the only model.

### Don't:

- **Don't** use `font-fugaz-one` anywhere except on the literal string "Xat". The wordmark is the wordmark.
- **Don't** add another `background-clip: text` gradient. The wanderer footer is the system's only sanctioned gradient text. Decorative gradients are forbidden.
- **Don't** add `backdrop-filter: blur()` as a decorative layer. Glassmorphism is forbidden. (The single code-button blur is a functional exception.)
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe. Side-stripe borders are a refused pattern across the whole system.
- **Don't** use `#000` or `#fff` in implementation. Stay in OKLCH. The one existing exception — `oklch(1 0 0)` as light-mode background — is grandfathered; new tokens should add a whisper of chroma toward 260°.
- **Don't** use Fraunces, Cormorant, Playfair, Newsreader, Crimson, Inter, DM Sans, IBM Plex, Space Grotesk, Outfit, Plus Jakarta, or Instrument Sans/Serif. They are training-data defaults. The site uses Hanken Grotesk for sans and Source Han Serif SC (subset) for the one serif use; do not add a second display family without strong reason.
- **Don't** build a "hero metric" template (big number + small label + supporting stats + gradient accent). The site is editorial, not SaaS dashboard.
- **Don't** lay out the home page or any landing page as a centered-stack hero with three identical icon-title-text cards. The site uses asymmetric layouts with leading mono numbers (`01`, `02`, `03`) on the side.
- **Don't** reach for a modal as the first thought for any flow. The site has no modals; popovers and hover cards are the affordance for inline context.
- **Don't** use uppercase letter-spaced labels as section eyebrows ("FEATURES" / "TESTIMONIALS"). The `Eyebrow` component is sentence-case, no tracking, no caps. Repeated tiny tracked-caps labels read as AI scaffolding.
- **Don't** introduce a new color scale (no `blue-50..blue-900` ramps in source). Status colors are imported from Tailwind as needed; the brand palette is the 6–8 tokens above.
- **Don't** set `font-variation-settings` on elements. MiSans maps Latin-facing `font-weight` values to tuned CJK `wght` axis values via `@font-face` descriptors; element-level axis overrides would bypass that CJK weight curve. (This is from `AGENTS.md`; carrying it forward.)
- **Don't** animate any CSS layout property (`width`, `height`, `padding`, `margin`, `top`, `left`). For collapsing regions, animate `grid-template-rows`. For motion, animate `transform`, `opacity`, and `filter`.
- **Don't** style code blocks to follow the site theme. Code is Vesper-dark in both light and dark site modes. The code surface is its own world.
- **Don't** write em dashes ("—") with `--` or otherwise; use the proper em dash character only where editorially needed, and reach for periods, colons, or parentheses first. (System-wide editorial rule.)
