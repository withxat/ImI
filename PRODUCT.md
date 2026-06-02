# Product

## Register

brand

## Users

The primary user is **Xat — me**. This is a personal expression river before it is a marketing surface; every other visitor encounters it as kin-of-Xat, not as the conversion target.

Secondary audiences, in descending priority:

- **Peer design engineers, AI product builders, frontend craftspeople** who arrive through a shared piece of writing, a tool, or word of mouth. They are scanning for taste signals as much as for content.
- **Recruiters, clients, and potential collaborators** who arrive after seeing the work elsewhere. The site is the credibility check, not the pitch deck.
- **Blog readers** who land via one specific essay and may stay for adjacent pieces. They read trilingually: zh primary, with en/ja available without a URL change.

Context of use: most visits are quiet, single-tab, often on a phone. People do not "use" this site — they read it, glance at it, bookmark it, and leave. There is no flow to optimize for, no funnel to convert through.

## Product Purpose

A trilingual home for writing, craft, and the act of building. It exists to:

1. **Be its own portfolio artifact.** The architecture (Astro SSR + Cloudflare Workers, cookie-based i18n with no URL prefix, custom scrollbar, reveal engine, hand-subsetted Source Han Serif) is itself the work being shown. The technical choices are the resume.
2. **Carry the writing.** Posts in zh/en/ja, MDX-authored, syntax-highlighted with Vesper, with per-locale text-wrap and line-break rules that respect each script's typography tradition.
3. **Signal positioning.** "Design Engineer working in the AI-native frontier." Through the work shown, the writing, and the way the site itself is built — not through a self-described "About" page that says it out loud.

Success priority is: **aesthetic memory → light connection → outbound reach.** A visitor leaving with "I remember Xat's site" matters more than a visitor leaving with a contact form filled out. RSS subscription, GitHub follow, or "I should DM Xat about this" is the middle band. Inbound contact is the long tail.

There is no analytics, no comments, no newsletter signup, no auth, no admin. The site has no CMS — content is git, deploys are commits.

## Brand Personality

**Crafted · Quiet · Playful.**

- **Crafted** — every choice on the surface has a reason underneath it. Per-locale `text-wrap` rules. A custom pill underline drawn with three background gradients per line so it survives wrapping cleanly. A subset font carrying exactly the glyphs the bio lead uses. The visitor cannot see most of this, but the cumulative effect reads as care.
- **Quiet** — the volume is low. Mono-ink palette. One accent color used on <10% of any screen. No marketing banners, no popups, no "What's new" toasts, no engagement bait. The site speaks softly because it has nothing to sell.
- **Playful** — but never solemn. A coin-flip mascot on the design page. A wanderer gradient in the footer that animates rose to cyan and greets the visitor by country. The "Xat" wordmark in Fugaz One, which has no business being there except that it is fun. Playfulness is allowed to occupy exactly the named, bounded places it occupies — never as ambient sparkle.

**Voice (for prose):** essayist. Long sentences welcome. Reflective, in-conversation-with-itself, not afraid of digression or repetition. The writing assumes a reader who is reading, not skimming. Headlines are sentence-case; copy never speaks in marketing voice; the second-person "you" is used sparingly, because the writing is not actually addressing a customer.

**Voice (for UI strings):** quiet, literal, slightly affectionate. "View all" not "Read all posts →". "Go to home" not "Take me home". Eyebrow labels are nouns, not commands.

## Anti-references

These are the things the site must never be confused with.

- **Another indie portfolio Astro/Next.js starter template.** The single loudest red line. The pattern: top-aligned nav + circular avatar + "Hi I'm X, a [role] who [skills]" + reverse-chronological post list + 3-card project grid + "Let's connect" CTA + LinkedIn/Twitter/GitHub footer. If a glance at the site could be mistaken for a hello-template, taking-portfolio, astro-paper, or notion-blog clone, the design has failed. The whole point of the site is that it does not look generated. Every layout, every component, every motion choice should be answering: *what makes this one not look like that?*
- **SaaS landing-page tropes.** Hero metric (`10M+ developers trust us`), three-column feature grid with rounded-corner icon above each heading, testimonial wall, big colored CTA button, "Built for the future of work" headline. The site is not selling a product; it must not borrow the grammar.
- **AI-tool neon-on-black.** The Vercel-AI-SDK / OpenAI-demo aesthetic (deep black background + purple-to-pink gradient hero + glass cards + animated mesh background). The site IS about AI-native work but rejects the saturated visual language that has become shorthand for it.
- **Editorial-magazine pastiche.** Fraunces italic display + drop caps + three-column broadsheet grid + small mono labels above every section + "Issue 04 · Spring 2026" cosplay. The site is not a magazine; pretending it is in 2026 is a tired second-order training reflex.
- **Brutalist / Y2K / terminal cosplay.** Marquee tags, jarring colors, system fonts pretending to be 90s OS chrome, ASCII art mastheads, fake-terminal hero blocks. None of these are the site's voice.
- **Luxury-perfume hush.** Centered stack, oversized whisper sans, blank gradient background, "A studio for considered work." The "premium minimal" lifestyle-brand template; restraint without commitment.

## Design Principles

Five principles. Strategic, not visual. (Visual rules live in `DESIGN.md`.)

1. **Implementation IS the portfolio.** The site is not a window onto the work — it IS the work. Every architectural decision is itself a portfolio artifact: the choice of Astro 6 SSR on Cloudflare Workers, the cookie-based i18n with no URL prefix, the reveal engine, the trilingual breaking rules, the hand-subsetted serif font. A visitor who reads the source is reading another piece of writing. Optimize for that visitor too.

2. **For myself first.** Build at the threshold of personal expression. Visitors are kin, not customers. No conversion funnels. No "Want to work together?" CTAs. No newsletter signup modals. The site is allowed to be inefficient at converting because converting is not the job. The job is being honest about how Xat works and what Xat finds interesting.

3. **Trilingual or it doesn't ship.** Every UI string lives in `src/lib/i18n/messages/{en,zh,ja}.ts` with the same shape. Every post is written in its source language and stays there; translations are a separate, marked artifact. Translation quality is part of craft — broken CJK line breaks, missing language tags, mojibake, or English copy hardcoded somewhere are all production bugs. The site cannot launch a feature in only one locale.

4. **Distinct from every other indie portfolio.** When in doubt, ask: "could a free Astro/Next.js template have produced this layout, this hero, this navigation, this section?" If yes, redesign. The bar is not "is this nice" but "does this only exist because Xat made it." This applies at every scale: page-level (no centered-stack hero), component-level (no icon-above-heading cards), micro-level (no gradient CTAs, no "Read more →" with chevron).

5. **Restraint with named exceptions.** The default is quiet. The accent color, the brand wordmark, the gradient text, the playful mascot — each has exactly one place it lives, and that constraint is what makes each one work. Adding a second use of any of them weakens all of them. New visual ideas earn one named slot or do not exist.

## Accessibility & Inclusion

Target: **WCAG 2.1 AA** as a floor, with specific commitments above it.

Implemented today:

- **Reduced motion.** Every animation in the site (page reveal, stagger children, article body line-reveal, wanderer gradient, coin-flip mascot, hover transforms) checks `prefers-reduced-motion: reduce` and disables itself. Reduced-motion users get the static, instant version of every screen, not a degraded one.
- **Trilingual document semantics.** `<html lang>` is set per visitor locale; the `htmlLangFor` helper exists so inline copy in another language (e.g. the serif bio lead containing zh characters when UI is en) gets its own `lang` attribute. Per-locale `text-wrap`, `line-break`, and `hyphens` rules apply at the `:lang()` selector level, not as overrides on individual elements.
- **Focus.** All interactive elements (Button prime, links, intro-badge popovers, custom scrollbar, coin button) have visible `:focus-visible` rings via `ring-ring/50` plus a 1px border shift. Focus is never removed; it is restyled.
- **Semantic HTML.** Headings nest correctly (one `<h1>` per page, `<h2>` for section titles, `<h3>` for subsections). Lists are `<ul>` / `<ol>`. Nav is `<nav>` (header) + `<footer>`. Article body is `<article>`. Icon-only buttons carry `aria-label`. Popovers use `role="dialog"` and HoverCard handles its own focus trap.
- **Color contrast.** Body text on background is well past AA (foreground `oklch(0.17)` on background `oklch(1)` ≈ 16:1; muted-foreground `oklch(0.45)` on background ≈ 6.4:1). The accent color is never used as body text; `text-highlight-strong` appears on identity terms and short emphasis only.
- **No flash on theme change.** A blocking inline script in `<head>` reads the stored theme and applies it before first paint. No flash of incorrect theme on navigation.

Known gaps to monitor:

- Custom scrollbar is keyboard-operable via arrow keys but has not been tested with all screen readers; the native scrollbar is preserved as a fallback affordance via `scrollbar-width: none` + visible custom strip, not by hijacking the system scrollbar entirely.
- PhotoSwipe gallery uses its built-in keyboard handling; verify before adding more gallery uses.
- Theme switcher and locale switcher are keyboard-focusable but the visual focus indicator on the active state has not been audited across all three locales for contrast.
