import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { Printer, Loader2, ArrowRight, Users, BadgeCheck, MessageCircle } from 'lucide-react'
import { generateLesson } from '../lib/generateLesson'
import type { Lesson } from '../lib/lesson'

export const Route = createFileRoute('/')({
  component: Home,
})

const LEVELS = ['A2', 'B1', 'B2', 'C1/C2'] as const
type Level = (typeof LEVELS)[number]

const TRACKS = [
  'General English',
  'IELTS Academic',
  'IELTS General',
  'Business English',
]

type RegionCode = 'GEN' | 'VEN' | 'KEN' | 'JEN'

const REGIONS: Record<
  RegionCode,
  {
    flag: string
    optionLabel: string
    badgeLabel: string
    badgeClass: string
    discussionTitle: string
    prompts: [string, string]
  }
> = {
  GEN: {
    flag: '🌐',
    optionLabel: 'Global (GEN)',
    badgeLabel: 'GEN Global Edition',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    discussionTitle: 'C. Related to Regional Context',
    prompts: [
      'How can local manufacturing and export hubs adopt automated tracking to boost shipping efficiency?',
      'What steps should local universities take to prepare graduates for automated supply chain management?',
    ],
  },
  VEN: {
    flag: '🇻🇳',
    optionLabel: 'Vietnam (VEN)',
    badgeLabel: 'VEN Vietnam Edition',
    badgeClass: 'bg-red-500/10 border-red-500/20 text-red-400',
    discussionTitle: 'C. Related to Vietnam',
    prompts: [
      'How can manufacturing hubs in Vietnam utilize AI tracking to boost export efficiency?',
      'What steps should Vietnamese universities take to prepare graduates for automated supply chains?',
    ],
  },
  KEN: {
    flag: '🇰🇷',
    optionLabel: 'Korea (KEN)',
    badgeLabel: 'KEN Korea Edition',
    badgeClass: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    discussionTitle: 'C. Related to Korea',
    prompts: [
      'How can Korean electronics exporters leverage AI tracking to streamline global distribution?',
      'How are technological shifts in logistics impacting job markets in Seoul?',
    ],
  },
  JEN: {
    flag: '🇯🇵',
    optionLabel: 'Japan (JEN)',
    badgeLabel: 'JEN Japan Edition',
    badgeClass: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    discussionTitle: 'C. Related to Japan',
    prompts: [
      'How can Japanese manufacturers use automated tracking to strengthen export reliability?',
      'What effect are these technological shifts having on logistics jobs in Tokyo and Osaka?',
    ],
  },
}

const TABS = [
  { id: 'summary', label: 'Article Summary' },
  { id: 'vocab', label: 'Core Language' },
  { id: 'comprehension', label: 'Reading & Listening' },
  { id: 'discussion', label: 'Communication & Discussion' },
  { id: 'answers', label: 'Teacher Answer Key' },
] as const
type TabId = (typeof TABS)[number]['id']

const CEFR_LEVELS = [
  {
    code: 'A2',
    name: 'Elementary',
    description: 'Simplified vocabulary, short sentences, and core tenses for early learners.',
  },
  {
    code: 'B1',
    name: 'Intermediate',
    description: 'Everyday topics with a growing range of tenses and connective phrases.',
  },
  {
    code: 'B2',
    name: 'Upper-Intermediate',
    description: 'Authentic news register, phrasal verbs, and nuanced opinion language.',
  },
  {
    code: 'C1/C2',
    name: 'Advanced',
    description: 'Full complexity and idiom, closest to the original article’s tone.',
  },
]

function Home() {
  const [url, setUrl] = useState('')
  const [level, setLevel] = useState<Level>('B2')
  const [track, setTrack] = useState(TRACKS[0])
  const [region, setRegion] = useState<RegionCode>('GEN')
  const [generating, setGenerating] = useState(false)
  const [showStudio, setShowStudio] = useState(false)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('summary')
  const studioRef = useRef<HTMLDivElement>(null)

  const activeRegion = REGIONS[region]

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setGenerating(true)
    setError('')
    try {
      const result = await generateLesson({ data: { url, level, track, learnerCountry: region === 'VEN' ? 'Vietnam' : region === 'KEN' ? 'South Korea' : region === 'JEN' ? 'Japan' : 'Global' } })
      setLesson(result.lesson)
      setShowStudio(true)
      requestAnimationFrame(() => studioRef.current?.scrollIntoView({ behavior: 'smooth' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while generating the lesson.')
      setShowStudio(false)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* MASTHEAD / HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-blue-500/20">
              GEN
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                GLOBALENGLISH NEWS
              </span>
              <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase block -mt-0.5">
                READ &middot; THINK &middot; SPEAK
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#worksheets" className="hover:text-white transition">Worksheet Set</a>
            <a href="#levels" className="hover:text-white transition">CEFR Levels</a>
            <Link to="/teachers" className="hover:text-white transition">Teachers</Link>
            <Link to="/faq" className="hover:text-white transition">FAQ</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionCode)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {(Object.keys(REGIONS) as RegionCode[]).map((code) => (
                <option key={code} value={code}>
                  {REGIONS[code].flag} {REGIONS[code].optionLabel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* HERO SECTION: ACTIVE LESSON GENERATOR */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>AI News Lesson Generator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            Turn any news article into an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              English lesson
            </span>
            .
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Paste a news article URL. Choose your level. Get a complete, classroom-ready lesson with
            vocabulary, grammar, reading, listening, discussion, speaking, and writing.
          </p>

          <form
            onSubmit={handleGenerate}
            className="bg-slate-900/90 p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur text-left space-y-5"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Paste Article URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.bbc.com/news/articles/c389n99d421o"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Choose CEFR Level
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-2 text-xs font-bold rounded-lg transition ${
                        level === lvl
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Select Focus Track
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition"
                >
                  {TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-70 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all text-base cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Article &amp; Transforming...</span>
                </>
              ) : (
                <>
                  <span>Generate ESL Lesson</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-200">
              <strong className="block mb-1">We couldn't generate this lesson.</strong>
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* GENERATED LESSON STUDIO VIEW */}
      {showStudio && (
        <section
          ref={studioRef}
          className="py-12 bg-slate-950 border-t border-slate-800 px-4 print-area"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 mb-8 gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 mb-1.5">
                  <span className="bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                    Level: {level}
                  </span>
                  <span className="bg-slate-800 px-2.5 py-0.5 rounded text-slate-300">{track}</span>
                  <span className={`px-2.5 py-0.5 rounded border ${activeRegion.badgeClass}`}>
                    {activeRegion.badgeLabel}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {lesson?.article.title || 'Generated Lesson'}
                </h2>
              </div>

              <div className="flex items-center space-x-3 no-print">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition shadow"
                >
                  <Printer size={14} />
                  <span>Print / Export PDF</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-2 border-b border-slate-800 overflow-x-auto pb-3 mb-8 no-print">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 print-card">
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-blue-400 uppercase tracking-wider text-xs">
                    Level-Calibrated Article Summary
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed bg-slate-950 p-6 rounded-xl border border-slate-800 print-card">
                    {lesson?.summary}
                  </p>
                </div>
              )}

              {activeTab === 'vocab' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-blue-400 uppercase tracking-wider text-xs mb-4">
                      Target Vocabulary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lesson?.vocabulary.map((item) => (
                        <div key={item.word} className="p-4 bg-slate-950 rounded-xl border border-slate-800 print-card">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-sm">{item.word}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{item.partOfSpeech}</span>
                          </div>
                          <p className="text-xs text-slate-300 mb-2">{item.definition}</p>
                          <p className="text-[11px] text-slate-400 italic">&ldquo;{item.example}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider text-xs mb-3">
                      Phrasal Verbs &amp; Natural Expressions
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300">
                      {lesson?.phrasalVerbs.map((item) => (
                        <div key={item.expression} className="p-3 bg-slate-950 rounded-lg border border-slate-800 print-card">
                          <strong className="text-emerald-400">{item.expression}:</strong> {item.meaning} <em>{item.example}</em>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comprehension' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-blue-400 uppercase tracking-wider text-xs mb-3">
                    Reading Comprehension Questions
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    {lesson?.reading.map((item, index) => (
                      <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 print-card">
                        <span className="font-bold text-blue-400 mr-2">{index + 1}.</span>{item.question}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-6">
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 print-card">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                      A. Think &amp; Discuss
                    </h4>
                    <p className="text-xs text-slate-300">
                      &bull; {lesson?.discussion.thinkAndDiscuss[0]}
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      &bull; {lesson?.discussion.thinkAndDiscuss[1]}
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      &bull; {lesson?.discussion.thinkAndDiscuss[2]}
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 print-card">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                      B. What If...?
                    </h4>
                    <p className="text-xs text-slate-300">
                      &bull; {lesson?.discussion.whatIf[0]}
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      &bull; {lesson?.discussion.whatIf[1]}
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      &bull; {lesson?.discussion.whatIf[2]}
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 print-card">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                      {activeRegion.discussionTitle}
                    </h4>
                    {lesson?.discussion.localConnection.map((prompt) => (
                      <p key={prompt} className="text-xs text-slate-300 mt-2">&bull; {prompt}</p>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'answers' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-amber-400 uppercase tracking-wider text-xs mb-3">
                    Teacher Answer Key (Detachable)
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3 print-card">
                    <div>
                      <strong className="text-white block mb-1">1. Vocabulary Solutions:</strong>
                      <p>{lesson?.answerKey.vocabulary as string}</p>
                    </div>
                    <div>
                      <strong className="text-white block mb-1">2. Comprehension Key:</strong>
                      <p>{Array.isArray(lesson?.answerKey.reading) ? lesson?.answerKey.reading.join(' ') : lesson?.answerKey.reading}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 max-w-6xl mx-auto px-4 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How GlobalEnglish News Works</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            A streamlined 4-step workflow to generate classroom-ready ESL materials instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Paste Article URL</h3>
            <p className="text-slate-400">Enter any real news link from trusted English publishers worldwide.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Select Level &amp; Track</h3>
            <p className="text-slate-400">
              Choose difficulty from A2 to C1/C2 and focus area (General, IELTS, Business).
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-white text-sm mb-1">AI Transformation</h3>
            <p className="text-slate-400">
              GEN rewrites the article and generates a complete worksheet package.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Print or Practice</h3>
            <p className="text-slate-400">
              Export clean classroom PDFs or practice interactively with built-in tools.
            </p>
          </div>
        </div>
      </section>

      {/* COMPLETE WORKSHEET PACKAGE OVERVIEW */}
      <section id="worksheets" className="py-16 bg-slate-900/50 border-t border-slate-800/80 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Worksheet Set
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Every generated lesson yields a standard pedagogical set tailored to your selected
              difficulty level.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-blue-400 text-sm mb-3 uppercase tracking-wider">Core Language</h3>
              <ul className="space-y-2 text-slate-300">
                <li>&bull; Target Vocabulary</li>
                <li>&bull; Vocabulary Matching</li>
                <li>&bull; Word Unscramble</li>
                <li>&bull; Level Grammar Points</li>
                <li>&bull; Phrasal Verbs &amp; Expressions</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-emerald-400 text-sm mb-3 uppercase tracking-wider">
                Reading &amp; Listening
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li>&bull; Level-Calibrated Summary</li>
                <li>&bull; Reading Comprehension</li>
                <li>&bull; Listening Gap-Fill</li>
                <li>&bull; Word Search Puzzle</li>
                <li>&bull; Crossword Puzzle</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-purple-400 text-sm mb-3 uppercase tracking-wider">Communication</h3>
              <ul className="space-y-2 text-slate-300">
                <li>&bull; A. Think &amp; Discuss</li>
                <li>&bull; B. What If...? Scenarios</li>
                <li>&bull; C. Regional Connection</li>
                <li>&bull; Speaking Practice Prompts</li>
                <li>&bull; Writing Task Prompts</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-amber-400 text-sm mb-3 uppercase tracking-wider">Teacher Material</h3>
              <ul className="space-y-2 text-slate-300">
                <li>&bull; Complete Answer Key</li>
                <li>&bull; Clean 2-Page PDF Export</li>
                <li>&bull; Digital Studio View</li>
                <li>&bull; Interactive Flashcards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CEFR LEVELS */}
      <section id="levels" className="py-16 max-w-6xl mx-auto px-4 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Every CEFR Level</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            The same article, rewritten at the right difficulty for your class.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {CEFR_LEVELS.map((lvl) => (
            <div key={lvl.code} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold mb-4">
                {lvl.code}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{lvl.name}</h3>
              <p className="text-slate-400">{lvl.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEACHER NETWORK */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-950/30 to-emerald-950/20 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4"><BadgeCheck size={15} /> Human speaking practice</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Read it. Think about it. Now speak about it.</h2>
            <p className="text-slate-400 mt-4 leading-relaxed text-sm">
              GEN is being built to connect learners with certified ESL teachers for focused 30-minute speaking sessions, private tutoring, and eventually local and corporate English training.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
              <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"><MessageCircle size={14} className="inline mr-2 text-blue-400" />30-minute speaking</span>
              <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"><Users size={14} className="inline mr-2 text-emerald-400" />Certified teachers</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Coming through GEN</p>
            <h3 className="text-xl font-bold text-white mt-2">Find a teacher when you are ready to speak.</h3>
            <p className="text-sm text-slate-400 mt-3">The article is the starting point. Human conversation is the next step.</p>
            <Link to="/teachers" className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-sm font-bold text-white">Explore Teacher Network <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 GlobalEnglish News (GEN). Read &middot; Think &middot; Speak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
