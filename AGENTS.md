# AGENTS.md

## Design Context

This project has two root-level design context files that all UI / design work should respect:

- **`PRODUCT.md`** — strategic context: register (`brand`), users, product purpose, brand personality, anti-references, design principles, accessibility.
- **`DESIGN.md`** — visual context: color tokens (OKLCH), typography, elevation, components, do's and don'ts. Follows the [Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/format/).

Companion: `.impeccable/design.json` (tonal ramps, shadow/motion tokens, component snippets, narrative) — machine-readable extensions consumed by the impeccable live panel.

Read PRODUCT.md before changing copy, IA, or strategic direction. Read DESIGN.md before changing visual tokens, components, or layout. The two files are the single source of truth; this AGENTS.md may lag behind them.

## Project Overview

Personal portfolio + blog for a design engineer / frontend engineer.

Core positioning:

- Design Engineer
- AI-native
- Personal brand site, not a generic blog
- Should feel crafted, fast, modern, minimal, slightly playful
- Technical implementation itself is part of the portfolio

This project showcases:

- design taste
- frontend engineering quality
- systems thinking
- modern Astro / edge architecture
- product sense

---

## Tech Stack

Framework:

- Astro 6 (server output, SSR by default)
- `@astrojs/cloudflare` adapter
- `@astrojs/mdx` for MDX content

Deployment:

- Cloudflare Workers (`wrangler.jsonc`)

Language:

- TypeScript (strict mode, `@withxat/tsconfig`)

Package manager:

- pnpm

Module system:

- ESM only

Styling:

- Tailwind CSS v4 (`@tailwindcss/vite`)
- `bejamas` UI component system (bejamas-juno style)
- `shadcn` CLI for adding UI primitives
- `tw-animate-css` for animation utilities
- CSS custom properties for light/dark theming (oklch palette)
- path alias: `@/` → `./src/`

Icons:

- `@iconify-json/lucide` via `unplugin-icons`
- Local SVG icons via `FileSystemIconLoader` from `./src/assets/icons`
- Usage: `import Icon from '~icons/local/arrow-up-right'`

Animation:

- `motion` (Framer Motion)
- Custom reveal engine (`src/lib/reveal-engine.ts`)
- Stagger reveals, article line reveals, page transitions

Content:

- MDX-based, git-managed, no CMS
- Astro content collections with glob loader
- Organized by locale: `content/posts/{en,zh,ja}/*.mdx`
- `content/config.json` for site-level structured data (capabilities, categories)

Fonts (self-hosted, `public/fonts/`):

- **Hanken Grotesk** (variable, roman + italic) — display / headings
- **Fugaz One** (subset) — brand accent
- **Calling Code** (regular, bold, italic) — monospace / code
- **Source Han Serif SC** (subset) — serif bio lead
- **MiSans VF** (via `vite-plugin-font`) — CJK content font, auto-generated fallbacks

Linting:

- ESLint with `@withxat/eslint-config`
- `better-tailwindcss` plugin (detects component classes, entry: `src/styles/globals.css`)
- `eslint-plugin-astro`

Git hooks:

- Lefthook

Content search / syntax highlighting:

- Expressive Code (Vesper theme) via `astro-expressive-code`

Gallery:

- PhotoSwipe (`photoswipe`)

Code formatting:

- `prettier` / `biome` or similar (check before assuming)

---

## Architecture Principles

### 1. Content-first, no database

Blog posts live in `content/posts/{locale}/*.mdx`.

No database, no D1, no comments system, no analytics tracking.

Site-level structured data (capabilities, categories) lives in `content/config.json`.

---

### 2. SSR-first with selective prerendering

`output: 'server'` in `astro.config.ts`.

Per-route control:

- `export const prerender = true` → static at build time (preferred for stable content)
- `export const prerender = false` (or default) → SSR at request time

Current pages:

| Route | Prerendered | Notes |
|---|---|---|
| `/` (home) | SSR | locale-dependent |
| `/post` (list) | SSR | locale-dependent |
| `/post/[slug]` | SSR | locale-dependent, 404 if missing |
| `/design` | SSR | design system reference |
| `/404` | SSR | fallback |
| `feed.xml`, `feed.en.xml`, `feed.ja.xml` | SSR | RSS feeds |
| `sitemap.xml` | SSR | sitemap |

---

### 3. Edge-native design

Assume Cloudflare runtime constraints (`nodejs_compat` flag enabled).

Prefer Web APIs (`fetch`, `Request` / `Response`).

Be careful with Node-only APIs, `fs` in runtime code, native binaries.

---

### 4. Internationalization (i18n)

Cookie-based locale: `imi_locale` cookie (`en`, `zh`, `ja`).

No URL prefix routing — all locales share the same paths.

Middleware (`src/middleware.ts`):

1. Reads `?set_locale=` query param → sets cookie → redirects (303)
2. Normalizes trailing slashes (308 redirect)
3. Resolves locale from cookie, then `Accept-Language` header
4. Reads Cloudflare visitor geo from `request.cf.country`

Messages live in `src/lib/i18n/messages/{en,zh,ja}.ts`, typed via `src/lib/i18n/messages/types.ts`.

Blog primary locale: `zh` (used for RSS and sitemap canonical).

Translation notices shown on non-Chinese post views when the source is Chinese.

---

### 5. Theming

Dark/light mode via `html.dark` class.

`localStorage` key: `theme` (values: `dark`, `light`, or absent for system).

Bootstrap script in `<head>` runs before paint to prevent flash.

Supports `prefers-color-scheme` as fallback.

Palette defined in CSS custom properties (`:root` / `.dark` / `@media prefers-color-scheme`) using oklch.

---

## Product Features

### Core Pages

- Home (`/`) — profile, bio, recent posts, capabilities grid
- Blog list (`/post`) — grouped by category
- Blog detail (`/post/[slug]`) — MDX with TOC, reading time, tags, prev/next nav, translator info
- Design system (`/design`) — color tokens, typography showcase
- 404

---

### Blog Features

- MDX rendering with Astro content collections
- Expressive Code syntax highlighting (Vesper theme)
- Heading anchor links
- Reading time
- Tags and categories
- Previous / next navigation
- Translator metadata (optional, for AI-translated posts)
- Per-locale RSS feeds
- Sitemap
- Canonical URLs
- Open Graph + Twitter card metadata
- JSON-LD structured data (Person, WebSite, BlogPosting, BreadcrumbList)
- PhotoSwipe image galleries
- Article reveal animations (staggered blur-in)
- CJK-friendly remark plugins (`remark-gfm`, `remark-cjk-friendly`)

---

### Home Page Features

- Avatar with preload
- Name with audio pronunciation button
- Bio lead in serif font (CJK-subset Source Han Serif)
- Intro badges with popover descriptions (systems / products)
- Recent posts (4 latest)
- Capabilities section with proof links

---

### Footer

- Wanderer gradient text animation (CSS-only, respects `prefers-reduced-motion`)
- Visitor country detection (Cloudflare `cf.country`) with localized country name
- Locale switcher
- RSS links

---

## Design Direction

Visual tone:

- premium minimal
- technical but warm
- playful details allowed
- NOT corporate SaaS
- NOT overly brutalist
- NOT template-looking

Keywords:

- Apple
- Linear
- Vercel
- crafted indie hacker
- design engineer portfolio

Typography: high priority — custom variable fonts, fallback stacks tuned per script (Latin, CJK).

Animation: subtle, intentional, respects `prefers-reduced-motion`.

Micro interactions: encouraged.

---

## Performance Targets

- LCP < 2s
- Minimal client JS (Astro islands architecture, zero JS by default)
- SSR-first HTML
- Font preload for critical faces
- View transitions (fade, 320ms) via Astro ClientRouter

---

## SEO

- Metadata per page via `<Seo>` component
- OG tags + Twitter cards
- Canonical URLs
- Sitemap (`/sitemap.xml`)
- RSS per locale (`/feed.xml`, `/feed.en.xml`, `/feed.ja.xml`)
- JSON-LD structured data
- `robots.txt` (if present)
- `hreflang` links for locale feeds

---

## Security

- Sanitize user content (if/when added)
- Validate payloads
- Prevent XSS

---

## Project Structure

```txt
/content
  /posts
    /en          # English MDX posts
    /zh          # Chinese MDX posts (primary)
    /ja          # Japanese MDX posts
  config.json    # capabilities, categories

/public
  /fonts         # self-hosted variable/subset fonts

/src
  /assets
    /icons       # local SVG icons (loaded by unplugin-icons)
  /components
    /mdx         # MDX element overrides (a, h1-h6, img, table, etc.)
    /ui          # reusable UI primitives (button, badge, container, popover, etc.)
    /ui-fonts    # font loading components
    *.astro      # page-level components (header, footer, seo, reveal, etc.)
  /layouts
    root-layout.astro
  /lib
    /i18n
      /messages  # per-locale message files + types
      *.ts       # locale resolution, cookie, switch logic
    /theme       # theme bootstrap + constants
    *.ts         # blog, seo-data, rss, reveal-engine, view-transition, etc.
  /pages
    index.astro
    404.astro
    design.astro
    /post
      index.astro
      [slug].astro
    feed.xml.ts
    feed.en.xml.ts
    feed.ja.xml.ts
    sitemap.xml.ts
  /scripts
    site-client.ts
  /styles
    globals.css
    photoswipe.css
  /types
    translator.ts
  content.config.ts
  env.d.ts
  global.d.ts
  middleware.ts
```

---

## Key Conventions

- Commit frequently, conventional commit style.
- Run `lint` and `lint:fix` after tasks; fix before commit.
- Path alias `@/` maps to `./src/` (configured in `tsconfig.json` and `astro.config.ts` via `jiti`).
- In `astro.config.ts`, use relative imports for `./src/...` because `@/` is not resolved during config loading.
- Components are `.astro` files (not `.tsx`) — zero client JS by default.
- Client-side JS is loaded via Astro islands or `<script>` tags that import from `/src/scripts/` or `/src/lib/*-client.ts`.
- `data-astro-prefetch` on links for prefetch-on-hover.
- `transition:animate` and `transition:persist` for Astro view transitions.
- Content collections are typed via `src/content.config.ts` using Zod schemas.
- i18n: use `getMessages(locale)` to get typed copy; add new strings to all three locale files + the types file.
- Do not set the `font-variation-settings` CSS property on elements. `MiSans Polish` maps Latin-facing `font-weight` values to tuned CJK `wght` axis values via `@font-face` descriptors; element-level `font-variation-settings` would override that mapping.

---

## Component Organization

Strict separation between vendor "prime" components and project-specific components:

### `src/components/ui/` — bejamas prime only

- Treat this directory as a **mirror of the bejamas registry**.
- Add components via `pnpm ui:add <name>` (which runs `bejamas add`).
- Each component lives in its own folder: `ui/<name>/<Name>.astro` + `index.ts`, PascalCase filenames.
- **Do NOT make significant modifications** to prime files. Tiny tweaks (e.g. data attributes, minor class additions) are tolerated, but anything beyond that should be lifted into a wrapper in `src/components/` instead.
- Keep imports inside prime files using the bejamas defaults (`@/lib/utils`, etc.) so they stay re-pullable / overwritable.

### `src/components/` — custom + composed

- **Composed prime**: components that wrap, combine, or extend prime parts (e.g. a card that uses `Button` + custom layout) live here.
- **Pure custom**: project-specific components with no prime equivalent (layout helpers, brand icons, page chrome, etc.) also live here.
- `src/components/mdx/` holds MDX element overrides.

### Rule of thumb

> Always prefer reaching for a bejamas prime component first. Only when prime cannot satisfy the design (or would require heavy modification) do we compose / derive a new component under `src/components/`. Never bend a prime component to fit; wrap it instead.

---

## Decision Bias

If a tradeoff appears:

Prefer:

- simplicity
- elegance
- performance
- edge compatibility
- maintainability

Avoid:

- heavy backend architecture
- auth complexity
- CMS complexity
- unnecessary dependencies

This is a personal site, not enterprise software.

---

## Important Product Philosophy

This site itself is part portfolio artifact.

Implementation quality matters as much as content.

Every technical decision should reinforce the personal brand:
"Design Engineer who deeply understands product, frontend architecture, and modern AI-era web engineering."
