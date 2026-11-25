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

- Astro 7 (server output, SSR by default)
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
- `@iconify-json/simple-icons` for brand marks (resume tech lists, `src/components/resume/tech-list.astro`)
- Local SVG icons via `FileSystemIconLoader` from `./src/assets/icons`
- Usage: `import Icon from '~icons/local/arrow-up-right'`

Animation:

- `motion` (Framer Motion)
- Custom reveal engine (`src/client/reveal-engine.ts`)
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
- **MiSans static instances** generated from MiSans VF (via `vite-plugin-font`) — CJK content font, auto-generated fallbacks

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

Blog posts live in `content/posts/{locale}/*.mdx`. A post with `unlisted: true` in its frontmatter (the Fluent Emoji render test) opens by its URL but stays out of post lists, newer/older links, RSS, and the sitemap.

No database, no D1, no comments system, no third-party analytics.

The one piece of server state is the footer view / presence counter: a single SQLite-backed Durable Object (`SiteStats`, `src/worker/site-stats.ts`) holding a total view count, a 24h per-session dedup table and in-memory online sessions. Middleware records views (bots and font-prefetch requests filtered in `src/lib/site-stats/tracking.ts`); the client sends `POST /api/presence.json` (which returns updated stats in the same round-trip, falling back to `GET /api/stats.json` when needed) and pauses while the tab is hidden. Stats are best-effort (400ms SSR timeout) and must never block rendering.

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
| `/post/[slug]` | SSR | locale-dependent; unknown slugs rewrite to `/404` |
| `/design` | SSR | living design spec, values read from running CSS |
| `/resume` | SSR | locale-dependent; content from `content/resume/{locale}.yaml`; A4 print stylesheet |
| `/404` | SSR | locale-dependent: copy and latest posts follow the visitor's locale |
| `feed.xml`, `feed.en.xml`, `feed.ja.xml` | static (build) | prerendered RSS feeds (`export const prerender = true`) |
| `/api/stats.json` (GET), `/api/presence.json` (POST) | SSR | site stats, `no-store` |
| `/sitemap-index.xml`, `/sitemap-0.xml` | static (build) | `@astrojs/sitemap`, zh canonical URLs |

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
5. Serves SSR HTML from the edge cache (`src/lib/edge-cache.ts`) when possible
6. After rendering (or a cache hit), records a site view / presence heartbeat for tracked HTML GETs (via `waitUntil`)

Edge HTML cache: Workers Cache API (`caches.default`), 10 min TTL, keyed by path + locale + visitor country + commit SHA (so each deploy starts cold). Only query-less, non-`/api/` GETs that return 200 `text/html` without `Set-Cookie` or `no-store`/`private` are stored. Per-visitor cookies are added after the cache lookup and never stored. Responses carry `X-Imi-Cache: HIT|MISS`. Disabled in `astro dev`. Anything new that renders per-request data into HTML (beyond locale and country) must either join the cache key or opt out with `Cache-Control: private`.

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

- Home (`/`) — profile, bio, recent posts, projects list
- Blog list (`/post`) — grouped by year, with dates; the header shows the post count and links the reader's locale feed (RSS)
- Blog detail (`/post/[slug]`) — MDX; under the title, the date, an estimated reading time, an "N sections" button (3+ h2s) that opens the custom scrollbar's section outline, and a link to the post's MDX on GitHub; a "Xat" sign-off with the post date, newer/older links and a link to the archive at the end, translator info
- Design system (`/design`) — typography (including the Hanken ↔ MiSans weight pairing from `CJK_WEIGHTS`), colors with contrast, trilingual wrapping, shape & shadow, motion; every value read from the running CSS (`src/client/design-specimens.ts`)
- Resume (`/resume`) — experience, open source, side projects, skills, education from `content/resume/{en,zh,ja}.yaml` (the `resume` collection); full-width experience reading, chip tech lists, section-outline jump, and hover email copy on screen, reverting to the tight 7rem two-column A4 light print layout with no site chrome; linked from the footer nav
- 404 — styled page with the latest posts, also used for unknown post slugs; when the requested path's last segment is close to a post slug, it asks whether that post was meant

---

### Blog Features

- MDX rendering with Astro content collections
- Expressive Code syntax highlighting (Vesper theme)
- Heading anchor links; each h2 ends in a hairline to the column edge
- Reading time (characters per minute for zh/ja, words for en; `readingMinutes` in `src/lib/blog.ts`)
- Section outline: the custom scrollbar's markers with their titles, opened from the "N sections" button; a jump tints the heading (`src/client/section-jump.ts`)
- External links in posts end with ↗
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

- Avatar with preload; poking it gets a reply in a speech bubble, and too many pokes make it sulk for a moment (`src/client/avatar-poke.ts`)
- Name with audio pronunciation button; the "Xat" letters hop on mouse enter and on playback
- Bio lead in serif font (CJK-subset Source Han Serif)
- Intro badges with popover descriptions (systems / products)
- Recent posts (4 latest) as date-led index rows
- Projects showcase sourced from `content/config.json`: an ImI spotlight card (linking to `/design` and GitHub), three selected project cards (`Dash`, `Mikan`, `Rehype-Fluent-Emoji`), and a bottom shelf row for config presets (`ESLint-Config`, `TSConfig`, `Monorepo-Template`)

---

### Footer

- Wanderer gradient text animation (CSS-only, respects `prefers-reduced-motion`)
- Visitor country detection (Cloudflare `cf.country`) with localized country name
- Social links (GitHub, Twitter, Telegram, Email) and the localized resume link; Email stays a `mailto:` link, and with a mouse a copy button grows after it on hover or focus (`src/client/email-copy.ts`)
- Repo link with commit SHA, ICP filing
- Site stats: total views + online now, animated with `number-flow` (no digit grouping); when the reader is the only one online (count ≤ 1), the online count reads "just you" instead

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
- Edge-cached SSR HTML (see middleware step 5)

---

## SEO

- Metadata per page via `<Seo>` component
- OG tags + Twitter cards
- Canonical URLs
- Sitemap (`/sitemap-index.xml`, `/sitemap-0.xml` via `@astrojs/sitemap`)
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
  /resume        # {en,zh,ja}.yaml, rendered at /resume
  config.json    # capabilities, categories

/public
  /fonts         # self-hosted variable/subset fonts

/src
  /assets
    /icons       # local SVG icons (loaded by unplugin-icons)
    /fonts       # build-time font sources and generated MiSans static instances
  /client        # browser-only modules registered by src/scripts/site-client.ts
  /components
    /fonts       # font loading / subset side-effect components
    /home        # intro badges, name pronunciation button
    /layout      # header, footer, container, text-link, locale/theme switchers
    /mdx         # MDX element overrides (a, h1-h6, img, table, etc.)
    /meta        # seo
    /motion      # reveal, stagger-reveal
    /post        # post index row, article body, translation notice
    /ui          # bejamas prime components (button, badge, popover, etc.)
  /layouts
    root-layout.astro
  /lib
    /fonts       # Vite font-subset plugins and MiSans glyph manifest generation
    /i18n
      /messages  # per-locale message files + types
      *.ts       # locale resolution, cookie, switch logic
    /og          # OG image templates, fonts, paths (rendered at build by scripts/)
    /site-stats  # view/presence tracking helpers + Durable Object client
    /theme       # theme bootstrap + constants
    *.ts         # SSR/shared helpers (blog, seo-data, rss, view-transition, etc.)
  /pages
    index.astro
    404.astro
    design.astro
    resume.astro
    /api
      stats.json.ts
      presence.json.ts
    /post
      index.astro
      [slug].astro
    feed.xml.ts
    feed.en.xml.ts
    feed.ja.xml.ts
    (sitemap via `@astrojs/sitemap` at build → `dist/client/sitemap-*.xml`)
  /scripts
    site-client.ts
  /styles
    globals.css
    photoswipe.css
  /types
    translator.ts
  /worker
    site-stats.ts  # SiteStats Durable Object
  content.config.ts
  env.d.ts
  global.d.ts
  middleware.ts
  worker.ts      # Worker entry: Astro handler + Durable Object export

/scripts         # build-time Node scripts (OG image generation; native deps like resvg live here, not in src/)

/e2e             # Playwright suite (site.spec.ts) and its screenshot baselines (__screenshots__)
```

`worker-configuration.d.ts` is generated by `wrangler types` on `postinstall` (gitignored); rerun `pnpm typegen` after editing `wrangler.jsonc`.

---

## Key Conventions

- Commit frequently, conventional commit style.
- Run `lint` and `lint:fix` after tasks; fix before commit.
- After UI changes, run `pnpm e2e:docker`. It builds the site, serves it under workerd, and checks six pages × three locales × 320/390/1280px for sideways scroll, console errors, and failed requests, then compares full-page screenshots (light at 1280 and 390 in every locale, dark at 1280 in zh). It runs in the Playwright image CI uses (`.github/workflows/e2e.yml`), because screenshots only match pixel for pixel there; plain `pnpm e2e` on another machine will report screenshot diffs. After an intended visual change, run `pnpm e2e:docker --update-snapshots`, look at the changed PNGs, and commit them with the change. Keep the image tag in the workflow and the script equal to `@playwright/test` in package.json.
- Path alias `@/` maps to `./src/` (configured in `tsconfig.json` and `astro.config.ts` via `jiti`).
- In `astro.config.ts`, use relative imports for `./src/...` because `@/` is not resolved during config loading.
- Components are `.astro` files (not `.tsx`) — zero client JS by default.
- Client-side JS lives in `src/client/` modules registered in `src/scripts/site-client.ts`; a page-local `<script>` is fine when only one page needs it. A module only one page uses (e.g. `design-specimens`) is registered with a dynamic `import()` behind a DOM check, so other pages do not ship it.
- `data-astro-prefetch` on links for prefetch-on-hover.
- `transition:animate` and `transition:persist` for Astro view transitions.
- Content collections are typed via `src/content.config.ts` using Zod schemas.
- i18n: use `getMessages(locale)` to get typed copy; add new strings to all three locale files + the types file.
- Do not set the `font-variation-settings` CSS property on elements. MiSans uses generated static instances at tuned CJK `wght` axis values mapped to Latin-facing `font-weight` values through the font pipeline; element-level axis overrides would bypass that CJK weight curve.
- **Page-column responsive layout:** `Container` is `@container/page` with `max-w-2xl`. When the column is at full width (~39rem content after padding), that is the desktop layout — not viewport `lg:`. Use `@lg/page:` / `@max-lg/page:` or the `page-grid-2` utility for multi-column blocks inside the column. Do not use viewport `lg:grid-cols-*` for page-level grids (container `@2xl` / 42rem never hits because padding reduces inline size below 42rem).

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
