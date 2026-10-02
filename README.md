# GlobalEnglish News (GEN)

GEN is an AI lesson generator for English teachers. A teacher pastes a news article URL, picks a CEFR level (A2 to C1/C2) and a focus track (General English, IELTS Academic, IELTS General, or Business English), and gets back a complete, classroom-ready lesson: a level-calibrated summary, target vocabulary, grammar points, reading comprehension questions, discussion prompts, and a teacher answer key — with a print-friendly export for handing out in class.

## What's live right now

- **Landing page** (`/`) — product pitch, "How It Works", the complete worksheet set overview, and a CEFR level explainer.
- **Lesson generator + Studio** — the interactive form and a tabbed lesson view (Article Summary, Core Language, Reading & Listening, Communication & Discussion, Teacher Answer Key), plus a regional edition switcher that localizes the discussion questions and a print/PDF export button.
- **FAQ page** (`/faq`).

The generator currently produces the same sample lesson for any input so the full experience is demonstrable end-to-end; wiring it up to real article fetching and AI-generated content is the next milestone — see `PLAN.md`.

## Tech stack

- [TanStack Start](https://tanstack.com/start) + TanStack Router (file-based routing)
- React 19, TypeScript, Vite 7
- Tailwind CSS 4
- Deployed on Netlify

## Running locally

```bash
npm install
npm run dev
```

This starts the Vite dev server. When developing against Netlify platform features (functions, database, etc. in future milestones), use the Netlify CLI instead:

```bash
netlify dev
```

## Roadmap

See `PLAN.md` for the full milestone breakdown: real article ingestion and AI-generated lesson content, a saved lesson library backed by the Netlify Database, teacher accounts, the remaining worksheet components (matching, unscramble, word search, crossword, listening gap-fill, flashcards), and print/export polish.

## Milestone 2 development note

The generator now uses a TanStack Start server function for the generation boundary. The server function:

1. Validates the article URL.
2. Fetches the public page without attempting to bypass access controls.
3. Performs conservative paragraph extraction.
4. Sends the extracted source to the OpenAI Responses API with the selected level, track, and learner country.
5. Parses and validates the structured lesson before returning it to the Lesson Studio.

Set `OPENAI_API_KEY` in the server environment. If extraction fails because a publisher blocks access, the UI reports the failure instead of pretending a lesson was generated.
