import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/faq')({
  component: FAQ,
})

const faqs = [
  {
    question: 'What is GlobalEnglish News (GEN)?',
    answer:
      'GEN is an AI lesson generator for English teachers. Paste a link to a real news article, choose a CEFR level and focus track, and GEN produces a complete classroom-ready lesson: a level-calibrated summary, target vocabulary, grammar points, reading and listening exercises, discussion prompts, and a teacher answer key.',
  },
  {
    question: 'What CEFR levels are supported?',
    answer:
      'GEN rewrites and calibrates every article for four levels: A2 (Elementary), B1 (Intermediate), B2 (Upper-Intermediate), and C1/C2 (Advanced). The same article can be regenerated at a different level for mixed-ability classes.',
  },
  {
    question: 'What are the Focus Tracks for?',
    answer:
      'Focus Tracks tailor the generated exercises to a purpose: General English for everyday classes, IELTS Academic and IELTS General for exam preparation, and Business English for workplace communication.',
  },
  {
    question: 'What is in the 12-component worksheet set?',
    answer:
      'Every lesson includes target vocabulary, vocabulary matching, a word unscramble, level-appropriate grammar points, phrasal verbs and expressions, a summary, reading comprehension questions, a listening gap-fill, a word search, a crossword, discussion and writing prompts, and a complete teacher answer key.',
  },
  {
    question: 'Can I localize discussion questions for my region?',
    answer:
      'Yes. The regional edition switcher in the header adapts the "Regional Connection" discussion section to your country, so students connect the article to industries and institutions they recognize.',
  },
  {
    question: 'How do I get a printable classroom copy?',
    answer:
      'Every lesson studio has a Print / Export PDF button. It produces a clean, black-and-white, teacher-friendly layout with the interactive tabs and navigation removed, ready to photocopy or save as a PDF.',
  },
  {
    question: 'Does GEN work with any news source?',
    answer:
      'GEN is designed to work with articles from any reputable English-language news publisher. Paste the article URL and GEN handles the rest.',
  },
]

function FAQ() {
  return (
    <div className="min-h-screen py-20 px-4 bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-center mb-14 max-w-xl mx-auto text-slate-400">
          Everything teachers ask before turning their first article into a lesson.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Accordion key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/60 transition-colors"
      >
        <span className="font-medium text-lg text-white">{question}</span>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 leading-relaxed text-slate-300">{answer}</div>
      )}
    </div>
  )
}
