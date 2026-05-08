# AGENTS.md

## Project Overview

Build a personal portfolio + blog website for a design engineer / frontend engineer.

Core positioning:

- Design Engineer
- AI-native
- Personal brand site, not a generic blog
- Should feel crafted, fast, modern, minimal, slightly playful
- Technical implementation itself is part of the portfolio

This project should showcase:

- design taste
- frontend engineering quality
- systems thinking
- modern React / edge architecture
- product sense

---

## Tech Stack (fixed decisions)

Framework:

- Waku (React 19 + RSC capable)

Deployment:

- Cloudflare Workers

Storage:

- Cloudflare D1 (SQLite)

Static assets:

- Cloudflare R2 (if needed)

Caching:

- Cloudflare Cache API
- optionally KV for lightweight aggregated stats cache

Protection:

- Cloudflare Turnstile

Language:

- TypeScript (strict mode)

Package manager:

- pnpm

Module system:

- ESM only

Styling:

- Tailwind CSS preferred
- modern minimal aesthetic
- avoid heavy UI frameworks unless necessary

Content:

- MDX-based
- Git-managed content
- NO CMS

---

## Architecture Principles

### 1. Content-first, database-second

Blog posts and portfolio projects should NOT be stored in the database.

Use filesystem content:

```txt
/content
  /posts
    *.mdx
  /projects
    *.mdx
```

Database is ONLY for dynamic interaction data:

- comments
- page views
- reactions / likes
- guestbook
- lightweight analytics

---

### 2. SSR-first, but not fully dynamic

We are intentionally embracing SSR / edge rendering.

However:

DO NOT make everything dynamic.

Preferred rendering strategy:

Home:

- SSR + aggressive edge cache

Portfolio detail pages:

- SSG / prerender preferred

Blog article pages:

- SSG / prerender preferred

Tag / archive pages:

- SSR + cache

Comment sections:

- dynamic client fetch

Analytics:

- dynamic API only

RSS:

- generated

Sitemap:

- generated

OG images:

- generated dynamically if feasible

Goal:
best perceived performance + SEO + architectural clarity.

---

### 3. Edge-native design

Assume Cloudflare runtime constraints.

Avoid Node-only APIs unless compatibility is explicitly supported.

Prefer:

- Web APIs
- fetch
- Request / Response
- edge-compatible libraries

Be careful with:

- fs usage in runtime code
- node crypto assumptions
- native binaries

---

## Product Features (MVP)

### Core Pages

Required:

- Home
- About
- Portfolio list
- Portfolio detail
- Blog list
- Blog detail
- Guestbook / Notes
- 404 page

Optional:

- Uses / Setup
- Changelog
- Experiments
- Lab

---

### Blog Features

Required:

- MDX rendering
- syntax highlighting
- headings TOC
- reading time
- tags
- previous / next navigation
- RSS
- sitemap
- canonical URLs
- Open Graph metadata

Optional:

- footnotes
- callouts
- embedded demos

---

### Portfolio Features

Each project page may include:

- overview
- problem
- design thinking
- implementation details
- technical decisions
- lessons learned

This is NOT just a screenshot gallery.

---

## Dynamic Features

### Comments

Anonymous comments only for MVP.

No login system.

Schema:

```sql
comments
- id
- slug
- author_name
- author_url nullable
- content
- status
- ip_hash
- created_at
```

status:

- pending
- approved
- spam

Rules:

- all new comments default to pending
- no public auto-publish

Anti-spam:

- Turnstile
- honeypot field
- rate limiting
- IP hashing (not raw storage)

---

### Page Views

Track lightweight analytics.

Schema:

```sql
page_views
- id
- slug
- visitor_hash
- referrer nullable
- country nullable
- created_at
```

Rules:

- never block page rendering
- send via client beacon
- API endpoint handles ingestion
- deduplicate obvious refresh spam

---

### Aggregated Stats

Optional table:

```sql
post_stats
- slug
- views
- likes
- updated_at
```

Use for:

- fast reads
- avoid counting raw page_views every render

---

### Reactions

Optional:
simple emoji reactions.

Example:

- like
- insightful
- fun

Keep implementation simple.

---

### Guestbook

Preferred over traditional comments branding.

Tone:
friendly / notebook / public notes

Schema similar to comments.

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

Typography:
high priority

Animation:
subtle, intentional

Micro interactions:
encouraged

Avoid:
gratuitous motion.

---

## Performance Targets

Target:
excellent Lighthouse / real performance.

Goals:

- LCP < 2s
- minimal JS
- SSR-first HTML
- stream where useful
- avoid hydration bloat

Prefer:
React Server Components where they make sense.

Do NOT force RSC everywhere.

---

## Security

Required:

- Turnstile for public submission
- basic rate limiting
- sanitize user content
- escape rendered comments
- validate payloads
- prevent XSS
- prevent spam flooding

Never:
store raw IP addresses if avoidable.

---

## SEO

Required:

- metadata
- OG tags
- twitter cards
- canonical
- sitemap
- RSS
- robots.txt
- structured data where useful

---

## Content Authoring Experience

Desired:
pleasant MDX authoring.

Support:

- code blocks
- images
- callouts
- custom components

Content authoring should remain simple.

No admin CMS.

Git workflow only.

---

## DX Requirements

Good developer experience matters.

Required:

- clean project structure
- strict TS
- reusable utilities
- env validation
- minimal abstraction
- edge-compatible architecture

Avoid:
overengineering.

---

## Suggested Project Structure

```txt
/src
  /app
  /components
  /content
  /lib
    /db
    /analytics
    /comments
    /seo
    /security
  /routes
  /styles
  /types

/schema
  db.sql
```

Adjust if Waku conventions suggest better structure.

---

## Cloudflare Notes

Use current best practices for:

- Waku on Workers
- Wrangler config
- D1 bindings
- Turnstile validation
- edge deployment

Cloudflare officially supports Waku deployment via Workers:
https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/waku/

Use modern supported patterns only.

---

## Implementation Strategy

Recommended order:

Phase 1:

- base Waku setup
- routing
- design system
- MDX content pipeline
- blog rendering
- portfolio rendering

Phase 2:

- SEO
- RSS
- sitemap
- OG images

Phase 3:

- D1 integration
- comments
- guestbook
- analytics

Phase 4:

- polish
- animations
- micro interactions
- performance tuning

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
