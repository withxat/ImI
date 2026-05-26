---
target: /Users/xat/Developer/imi/src/pages/index.tsx
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-05-14T06-01-55Z
slug: src-pages-index-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3 | Theme and language controls are present, but the current page/location is barely signaled. |
| 2 | Match System / Real World | 3 | Copy speaks to design engineering, but portfolio proof is less concrete than the positioning. |
| 3 | User Control and Freedom | 3 | Navigation is simple and reversible; icon-only theme control is visually underexplained. |
| 4 | Consistency and Standards | 4 | Components, spacing, links, and interaction language are consistent. |
| 5 | Error Prevention | 3 | Mostly static, low-risk surface; no obvious risky actions. |
| 6 | Recognition Rather Than Recall | 3 | Writing links are clear, but project/capability hierarchy asks visitors to infer importance. |
| 7 | Flexibility and Efficiency | 2 | Fine for reading, but not much shortcuting or alternate scanning for recruiters/collaborators. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and tasteful, but the page is close to under-signaled for a portfolio artifact. |
| 9 | Error Recovery | 3 | Few error surfaces on this route; no major issue observed. |
| 10 | Help and Documentation | 3 | Contextual popovers help the intro, but the portfolio story lacks comparable guidance. |
| **Total** | | **30/40** | **Good foundation, needs stronger portfolio signal.** |

## Anti-Patterns Verdict

This does not read as generic AI landing page slop. It avoids the loudest tells: no oversized fake hero metrics, no glass cards, no neon dark-mode hero, no generic icon grid. The craft is real, especially in the localization details, serif/sans contrast, small pronunciation affordance, and inline intro badges.

The risk is the opposite: it may read too much like a quiet personal blog before it reads like a design engineer portfolio. The first viewport says "Xat, Design Engineer", but it does not yet make the implementation itself feel like the artifact.

Deterministic scan found 1 issue:

- `gradient-text` in `src/styles/globals.css:276`, from `.wanderer-gradient-text`. This violates the impeccable absolute ban on gradient text. If this footer treatment is important, replace it with a solid color, underline choreography, weight shift, or a small animated mark.

## Overall Impression

Tasteful, warm, restrained, and technically cared-for. The biggest opportunity is to make the homepage's proof of craft more decisive. Right now the strongest visual event is a stack of pink-bordered list cards, not a distinctive portfolio moment.

## What's Working

- The page has a coherent quiet voice. The Fugaz "Xat" mark, avatar, pronunciation button, and pink accent give it a human signature without turning the page into a gimmick.
- The writing and capability cards are easy to scan, and the hover/arrow language is consistent.
- The multilingual implementation feels unusually cared-for, including CJK wrapping decisions and locale-specific copy.

## Priority Issues

### [P1] Homepage undersells the portfolio premise

The hero at `src/pages/index.tsx:50-83` is controlled and pleasant, but it stops at title plus tagline. For a design engineer portfolio, the first screen needs one sharper artifact-level signal: a featured project, a live component specimen, a tiny systems diagram, a crafted interaction, or a stronger narrative hook.

Why it matters: recruiters, collaborators, and design peers decide quickly whether this is a portfolio or a blog. The current first impression is likable but not yet unmistakable.

Fix: add a compact "current proof" module near the intro, or promote one capability/project above Writing. Keep the minimal tone, but make the work visible earlier.

Suggested command: `impeccable bolder homepage`

### [P1] Repeated card treatment flattens the work

`HomeCardLink` in `src/components/home-card-link.tsx:76-83` is reused for writing, project links, empty states, and capability items. It is consistent, but all proof points get the same weight and shape.

Why it matters: identical cards make the portfolio feel more like an archive list than a deliberately directed story.

Fix: keep `HomeCardLink` for posts, but give capabilities/projects a different treatment: inline case rows, numbered proof notes, richer project previews, or a split rhythm where only the most important item gets a framed surface.

Suggested command: `impeccable layout homepage`

### [P2] Mobile intro badges wrap awkwardly

On 390px mobile, "intelligent products" breaks into two pill fragments. The source lives around `src/pages/index.tsx:95-110`, likely via `IntroBadgePopover` styling.

Why it matters: the badges are one of the page's signature details, so broken wrapping makes a crafted element feel accidental.

Fix: make badge labels avoid internal hyphenation/wrapping, or allow the badge to become a normal inline text link on narrow widths. Do not let the pill split into separate visual chunks.

Suggested command: `impeccable adapt homepage`

### [P2] Color system is refined in light mode, less principled in dark mode

Light tokens use OKLCH and tinted neutrals in `src/styles/globals.css:493-535`. Dark mode switches to raw hex values and pure `#ffffff` at `src/styles/globals.css:538-580` and again in the media query.

Why it matters: the site positions technical implementation as part of the portfolio. Token discipline is visible craft here, even if visitors only feel the result.

Fix: convert dark tokens to OKLCH tinted neutrals, avoid pure white/black, and deduplicate the `.dark` and `prefers-color-scheme` token blocks.

Suggested command: `impeccable colorize theme tokens`

### [P3] Gradient text should be retired

`.wanderer-gradient-text` at `src/styles/globals.css:264-280` is the only automated AI-tell hit.

Why it matters: one small footer flourish will not ruin the site, but the rule exists because gradient text has become a recognizable generated-design fingerprint.

Fix: replace it with a single solid accent, subtle animated underline, or a small mark next to the word.

Suggested command: `impeccable polish footer`

## Persona Red Flags

Jordan, first-timer: within five seconds, Jordan understands that Xat is a design engineer, but not which work to click first. "Capabilities" reads abstractly, and the most concrete proof is below the writing list.

Casey, distracted mobile user: Casey gets a readable page, but the broken inline badge and top-positioned controls are the two fragile spots. The important content is still accessible, but the signature detail loses polish on mobile.

Riley, stress tester: Riley will notice that the design system promises OKLCH/tinted restraint in light mode but uses raw dark hex tokens. They will also catch the duplicated dark token block and gradient text exception.

## Cognitive Load

Failure count: 1/8, low cognitive load. The page is simple, grouped, and easy to read. The only meaningful miss is visual hierarchy: everything after the intro has similar weight, so the intended next step is not obvious.

## Minor Observations

- The card border color is charming but starts to dominate when many cards stack.
- The "View all" link is clear, but it is visually as interesting as the section title, which slightly splits attention.
- `PRODUCT.md` and `DESIGN.md` are missing, so this run used `AGENTS.md` as context. Add those files for more calibrated future critiques.

## Questions To Consider

- Should the first screen make people feel "quiet writer" or "design engineer with taste and systems depth"?
- Which artifact deserves to be the homepage's proof of craft: OpenCat, frontend systems, AI product experience, or the site itself?
- Are the pink bordered cards the brand language, or just the current default component?
