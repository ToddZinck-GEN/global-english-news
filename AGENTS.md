# AGENTS.md

This document orients AI agents and developers working on this codebase.

## Project Overview

GlobalEnglish News (GEN) is an AI lesson generator for English teachers: paste a news article URL, pick a CEFR level and focus track, and get a classroom-ready worksheet set (vocabulary, grammar, reading, listening, discussion, writing, answer key).

The current build is the branded product surface — landing page plus an interactive lesson generator and "Lesson Studio" view — using realistic stubbed lesson content. Real article fetching and AI-generated content are not wired up yet. See `PLAN.md` for the full roadmap and continue future work from there.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (utility classes, no component library) |
| Icons | lucide-react |
| Language | TypeScript 5.9 |
| Deployment | Netlify |

## Directory Structure

```
├── public/
│   └── favicon.ico
├── src/
│   ├── routes/
│   │   ├── __root.tsx   # Root layout: <html>/<body>, meta tags, Google Fonts link, global dark theme
│   │   ├── index.tsx    # Landing page + generator form + Lesson Studio (stubbed lesson content)
│   │   └── faq.tsx       # FAQ accordion
│   ├── router.tsx        # TanStack Router setup (routeTree.gen.ts is auto-generated at build time)
│   └── styles.css        # Tailwind import, font-family, print stylesheet for classroom PDF export
├── netlify.toml           # Build command (vite build), publish dir (dist/client), dev server port
├── PLAN.md                # Product roadmap — start here for the next milestone
└── vite.config.ts
```

## Key Concepts

### Lesson Studio (`src/routes/index.tsx`)

All lesson content (summary, vocabulary, comprehension questions, discussion prompts, answer key) is currently hardcoded sample data inline in the component, keyed off a fixed sample article ("Global Supply Chains Adapt to New Automation Trends"). The CEFR level, focus track, and region selectors change badges/labels and (for region) the "Regional Connection" discussion prompts, but do not yet regenerate the underlying lesson content — that requires the AI generation step described in `PLAN.md` (Milestone 2).

`REGIONS`, `TABS`, `CEFR_LEVELS`, `LEVELS`, and `TRACKS` at the top of `index.tsx` are the config to extend when adding new regions, tabs, or levels.

### Print / PDF export

The `.print-area` / `.print-card` / `.no-print` classes plus the `@media print` block in `src/styles.css` control what appears when a teacher clicks "Print / Export PDF" (calls `window.print()`). Keep new Studio content inside a `.print-card` if it should render on the printed sheet.

## Conventions

- Routes: file-based under `src/routes/`, kebab or camel file names map to URL paths (see the `tanstack-start-routes` skill).
- Styling: Tailwind utility classes only; dark theme (`slate-950`/`slate-900` backgrounds) is set globally on `<body>` in `__root.tsx`.
- State: local React hooks; no global state library is in use yet.
- TypeScript: strict mode; prefer `as const` + derived types (see `Level`, `TabId`, `RegionCode`) over enums.

## Where to go next

Read `PLAN.md` before starting new work — it lays out the milestones after this UI: real article ingestion + AI-generated lesson content via the AI Gateway, database persistence for a lesson library, teacher accounts, the remaining worksheet components (matching, unscramble, word search, crossword, listening gap-fill, flashcards), and print/export polish.
