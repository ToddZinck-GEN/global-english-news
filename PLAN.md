# GlobalEnglish News (GEN) — Product Roadmap

## Milestone 1 — Branded product surface (done)

The landing page and interactive lesson generator are live at `/`, plus an FAQ page at `/faq`:

- Hero with the article-URL form, CEFR level picker (A2/B1/B2/C1-C2), and Focus Track selector (General/IELTS Academic/IELTS General/Business).
- A simulated "Lesson Studio" that appears after generating: tabbed panels for Article Summary, Core Language, Reading & Listening, Communication & Discussion, and Teacher Answer Key, all using realistic stubbed lesson content in `src/routes/index.tsx`.
- A regional edition switcher (Global/Vietnam/Korea/Japan) that localizes the "Regional Connection" discussion questions.
- A print-friendly stylesheet for classroom PDF export.
- "How It Works", "Worksheet Set", and "CEFR Levels" marketing sections, and an FAQ page.

All lesson content shown today is fixed sample data — no article is actually fetched or rewritten yet. That's the next milestone.

## Milestone 2 — Real article ingestion + AI lesson generation

- Add a server function/API route that accepts an article URL, fetches and extracts the article's main text (readability-style extraction), and validates the URL/content before sending it to a model.
- Use the AI Gateway (see `netlify-ai-gateway` skill) to generate the full worksheet set from the extracted article text, CEFR level, and focus track: summary, vocabulary + definitions + example sentences, grammar points, phrasal verbs, comprehension questions, discussion prompts (including the regional variant), and the teacher answer key — as structured JSON the studio view can render directly in place of the stubbed data.
- Add loading, error, and retry states for slow fetches, unreachable URLs, or paywalled/non-article pages.

## Milestone 3 — Persistence and lesson library

- Provision the Netlify Database (Postgres + Drizzle) per the `netlify-database` skill.
- Schema: `lessons` (source URL, level, track, region, generated content, created_at) and, if teacher accounts are added, a `users`/`teachers` table.
- Save every generated lesson so it has a shareable, permanent URL and appears in a "My Lessons" library instead of only living in page state.

## Milestone 4 — Teacher accounts

- Add Netlify Identity (see `netlify-identity` skill) so teachers can sign in, keep a private lesson library, and revisit past generations.
- Gate the lesson library and re-print/export actions behind login; keep the generator itself usable without an account to preserve a frictionless first-use experience.

## Milestone 5 — Remaining worksheet components

The Studio currently covers 5 of the advertised 12 worksheet components. Extend generation and the UI to add:
- Vocabulary matching, word unscramble, word search, and crossword puzzle generators (client-side puzzle-grid generation from the AI-produced vocabulary list).
- Listening gap-fill (requires a generated audio narration or a text-to-speech step — evaluate options in the `netlify-ai-gateway` skill).
- Interactive flashcards view for the target vocabulary.

## Milestone 6 — Polish

- Multi-page print/export layout matching the "Clean 2-Page PDF Export" promise (currently a single continuous print view).
- Rate limiting / abuse protection on the generation endpoint once it calls a paid AI model.
