# Domain Glossary

## Content

- **Post** — a blog article stored as MDX in `/content/posts/{locale}/{slug}.mdx`. Has metadata: title, date, category, summary, tags, optional translator.
- **Category** — a grouping for posts (life, tech, design). Defined in `/content/config.json`.
- **Capability** — a portfolio skill area shown on the home page. Has items (proof links) and optional empty state. Defined in config.json.

## Locale

- **Locale** — one of `en`, `zh`, `ja`. Determines UI language and content selection.
- **Messages** — the full set of UI copy for a locale. One object per locale in `i18n/messages.ts`.
- **Primary Locale** — `zh` is the canonical writing locale for RSS/sitemap purposes.

## Page

- **Home** — the landing page with bio, intro badges, writing section, capabilities.
- **Post List** — `/post` — grouped by category.
- **Post Detail** — `/post/[slug]` — rendered MDX with SEO metadata.
- **Root Layout** — the shell wrapping all pages: head, theme bootstrap, footer.

## UI Patterns

- **Reveal** — an element that fades in on scroll/entrance. Controlled by `data-reveal` attributes.
- **Stagger Reveal** — a container whose children reveal sequentially. Controlled by `data-stagger-reveal`.
- **Article Reveal** — article body children that reveal on scroll. Uses CSS classes.
- **Intro Badge** — a popover explaining "systems background" or "intelligent products".
- **Theme Switcher** — dropdown to toggle light/dark/system theme.
- **Locale Switcher** — links that swap the locale cookie via middleware redirect.

## Infrastructure

- **Middleware** — Astro middleware that resolves locale, normalizes URLs, reads visitor geo.
- **Visitor Geo** — country code from Cloudflare `cf.country` header.
- **PhotoSwipe** — image lightbox for article images.
- **Expressive Code** — syntax-highlighted code blocks with copy buttons.
