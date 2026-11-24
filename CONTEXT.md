# Domain Glossary

## Content

- **Post** — a blog article stored as MDX in `/content/posts/{locale}/{slug}.mdx`. Has metadata: title, date, category, summary, tags, optional translator.
- **Category** — a grouping for posts (life, tech, design). Defined in `/content/config.json`.
- **Capability** — a titled group of projects in `/content/config.json`. Groups have no UI of their own: the home page flattens their items into one Projects list, in reverse config order.

## Locale

- **Locale** — one of `en`, `zh`, `ja`. Determines UI language and content selection.
- **Messages** — the full set of UI copy for a locale. One object per locale in `src/lib/i18n/messages/{en,zh,ja}.ts`, typed by `types.ts`.
- **Primary Locale** — `zh` is the canonical writing locale for RSS/sitemap purposes.

## Page

- **Home** — the landing page with bio, intro badges, the four latest posts, and the Projects list.
- **Post List** — `/post` — grouped by year, newest first.
- **Design** — `/design` — the living design spec; every value on it is read from the running CSS.
- **Resume** — `/resume` — experience, open source, side projects, skills, and education, one YAML file per locale in `/content/resume`. Prints on A4.
- **Post Detail** — `/post/[slug]` — rendered MDX with SEO metadata.
- **Root Layout** — the shell wrapping all pages: head, theme bootstrap, footer.

## UI Patterns

- **Reveal** — an element that fades in on scroll/entrance. Controlled by `data-reveal` attributes.
- **Stagger Reveal** — a container whose children reveal sequentially. Controlled by `data-stagger-reveal`.
- **Article Reveal** — article body children that reveal on scroll. Uses CSS classes.
- **Index Row** — one hairline-divided list row: mono date, title, optional summary. Used by the writing and projects lists.
- **Intro Badge** — a popover explaining "systems background" or "intelligent products".
- **Theme Switcher** — dropdown to toggle light/dark/system theme.
- **Locale Switcher** — links that swap the locale cookie via middleware redirect.

## Infrastructure

- **Middleware** — Astro middleware that resolves locale, normalizes URLs, reads visitor geo.
- **Visitor Geo** — country code from Cloudflare `cf.country` header.
- **PhotoSwipe** — image lightbox for article images.
- **Expressive Code** — syntax-highlighted code blocks with copy buttons.
- **Site Client** — the browser-only module registry initialized by `src/scripts/site-client.ts`. Feature modules live in `src/client`.
- **Font Pipeline** — build-time font subsetting and MiSans CJK weight mapping. Vite plugins live in `src/lib/fonts`; font-loading Astro components live in `src/components/fonts`.
