import { createServerFn } from '@tanstack/react-start'
import { LEVEL_CONFIG, type Level, type Lesson, validateLesson } from './lesson'

type GenerateInput = {
  url: string
  level: Level
  track: string
  learnerCountry: string
}

type ExtractedArticle = {
  title: string
  sourceName: string
  sourceUrl: string
  text: string
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function getMeta(html: string, name: string) {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i')
  return html.match(re)?.[1]?.trim()
}

function domainName(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'Unknown source' }
}

async function extractArticle(url: string): Promise<ExtractedArticle> {
  let parsed: URL
  try { parsed = new URL(url) } catch { throw new Error('Please enter a valid article URL.') }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http and https article URLs are supported.')

  const response = await fetch(parsed.toString(), {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlobalEnglishNews/0.1; +https://globalenglish.news)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`The publisher returned HTTP ${response.status}. The article may be unavailable or access restricted.`)

  const html = await response.text()
  const title = getMeta(html, 'og:title') || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || parsed.pathname.split('/').filter(Boolean).pop() || 'Untitled article'

  // Deliberately conservative extraction. A production extractor can replace this adapter later.
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => htmlToText(m[1]))
    .filter((p) => p.length >= 45)
  const text = paragraphs.join('\n\n').slice(0, 45000)

  if (text.length < 700) throw new Error('We could not extract enough article text. The page may be paywalled, JavaScript-only, blocked, or not an article. Please paste the article text instead.')

  return { title, sourceName: domainName(parsed.toString()), sourceUrl: parsed.toString(), text }
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1]
  const candidate = fenced || text.match(/\{[\s\S]*\}/)?.[0]
  if (!candidate) throw new Error('The AI returned an invalid lesson response.')
  return JSON.parse(candidate)
}

export const generateLesson = createServerFn({ method: 'POST' })
  .validator((data: GenerateInput) => data)
  .handler(async ({ data }) => {
    const article = await extractArticle(data.url)
    const config = LEVEL_CONFIG[data.level]
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured on the server yet.')

    const prompt = `You are the lesson-generation engine for GLOBALENGLISH NEWS (GEN), an English-learning platform for learners age 17+.

SOURCE ARTICLE
Title: ${article.title}
Source: ${article.sourceName}
URL: ${article.sourceUrl}

ARTICLE TEXT:
${article.text}

LESSON SETTINGS
Level: ${data.level}
Track: ${data.track}
Learner country: ${data.learnerCountry}
Summary target: ${config.summaryWords} words

Create an ORIGINAL English-learning lesson from the source. Do not copy the article sentence-by-sentence. Preserve source facts and uncertainty; never invent statistics, quotations, events, people, or claims. The local-connection questions should connect the article topic to ${data.learnerCountry} without inventing country-specific facts.

Return JSON only with exactly these top-level keys:
meta, article, summary, vocabulary, vocabularyMatching, vocabularyUnscramble, grammar, phrasalVerbs, reading, listening, discussion, speaking, writing, wordSearch, crossword, answerKey.

Requirements:
- summary: approximately ${config.summaryWords} words and written at ${data.level}.
- vocabulary: 8-12 useful target words with part of speech, learner-friendly definition, and original example.
- vocabularyMatching: 8 items using the vocabulary words.
- vocabularyUnscramble: 6 items whose answers exactly match vocabulary words.
- grammar: 3-5 teachable grammar points grounded in the source topic.
- phrasalVerbs: 4-6 natural expressions suitable for this level.
- reading: 5-6 comprehension questions with concise answers.
- listening.text: an original short listening passage based on the article, not a copy; create 6 gaps.
- discussion.thinkAndDiscuss: 3 questions.
- discussion.whatIf: 3 hypothetical questions.
- discussion.localConnection: 3 questions related to ${data.learnerCountry}.
- speaking: 3 prompts; use IELTS-style framing when the track is IELTS.
- writing: 2 prompts; use IELTS-style framing when the track is IELTS.
- wordSearch: 10 vocabulary answers.
- crossword: 8 clues with answers.
- answerKey: provide answers for every closed-answer activity.

Make the output useful to a real English teacher, not merely grammatically correct.`

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        input: prompt,
        max_output_tokens: 12000,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`AI generation failed (${response.status}). ${detail.slice(0, 300)}`)
    }

    const raw = await response.json()
    const outputText = raw.output_text || raw.output?.flatMap((item: any) => item.content || []).find((part: any) => part.type === 'output_text')?.text
    if (!outputText) throw new Error('The AI response did not contain lesson text.')

    const lesson = extractJson(outputText) as Lesson
    lesson.meta = {
      level: data.level,
      track: data.track,
      learnerCountry: data.learnerCountry,
      summaryTargetWords: config.summaryWords,
    }
    lesson.article = {
      ...lesson.article,
      title: article.title,
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
    }

    const validation = validateLesson(lesson)
    if (!validation.valid) {
      throw new Error(`Generated lesson failed validation: ${validation.errors.join(' ')}`)
    }

    return { lesson, validation }
  })
