export const LEVEL_CONFIG = {
  A2: { track: 'KET', summaryWords: 250, profile: 'A2 / Elementary' },
  B1: { track: 'PET', summaryWords: 350, profile: 'B1 / Intermediate' },
  B2: { track: 'FCE', summaryWords: 550, profile: 'B2 / Upper-Intermediate' },
  'C1/C2': { track: 'IELTS / Business', summaryWords: 750, profile: 'C1/C2 / Advanced' },
} as const

export type Level = keyof typeof LEVEL_CONFIG

export type Lesson = {
  meta: {
    level: Level
    track: string
    learnerCountry: string
    summaryTargetWords: number
  }
  article: {
    title: string
    sourceUrl: string
    sourceName: string
    publishedAt?: string
  }
  summary: string
  vocabulary: Array<{ word: string; partOfSpeech: string; definition: string; example: string }>
  vocabularyMatching: Array<{ id: string; word: string; definition: string }>
  vocabularyUnscramble: Array<{ id: string; scrambled: string; answer: string }>
  grammar: Array<{ point: string; explanation: string; example: string }>
  phrasalVerbs: Array<{ expression: string; meaning: string; example: string }>
  reading: Array<{ id: string; question: string; answer: string }>
  listening: { text: string; gaps: Array<{ number: number; answer: string }> }
  discussion: {
    thinkAndDiscuss: string[]
    whatIf: string[]
    localConnection: string[]
  }
  speaking: string[]
  writing: string[]
  wordSearch: string[]
  crossword: Array<{ clue: string; answer: string }>
  answerKey: Record<string, string | string[]>
}

export function validateLesson(lesson: Lesson) {
  const errors: string[] = []
  const target = LEVEL_CONFIG[lesson.meta.level].summaryWords
  const words = lesson.summary.trim().split(/\s+/).filter(Boolean).length
  const tolerance = Math.max(20, Math.round(target * 0.08))

  if (Math.abs(words - target) > tolerance) {
    errors.push(`Summary is ${words} words; target is ${target} ± ${tolerance}.`)
  }
  if (!lesson.article.title) errors.push('Article title is missing.')
  if (!lesson.summary) errors.push('Summary is missing.')
  if (lesson.vocabulary.length < 6) errors.push('Vocabulary set is too small.')
  if (lesson.reading.length < 4) errors.push('Reading comprehension set is too small.')
  if (lesson.discussion.localConnection.length < 2) errors.push('Local connection questions are missing.')

  const vocabWords = new Set(lesson.vocabulary.map((v) => v.word.toLowerCase()))
  for (const item of lesson.vocabularyUnscramble) {
    if (!vocabWords.has(item.answer.toLowerCase())) errors.push(`Unscramble answer is not in vocabulary: ${item.answer}`)
  }

  return { valid: errors.length === 0, errors, summaryWords: words }
}
