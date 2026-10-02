import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, CalendarDays, Globe2, MapPin, MessageCircle, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/teachers')({
  component: Teachers,
})

const sampleTeachers = [
  { name: 'Certified Teacher', mode: 'Online', location: 'Global', specialties: 'Speaking · IELTS · Business English', rate: '$10 / 30 min' },
  { name: 'Local ESL Teacher', mode: 'In person + Online', location: 'Ho Chi Minh City', specialties: 'General English · IELTS', rate: '$15 / hour' },
  { name: 'Business English Teacher', mode: 'Online', location: 'Global', specialties: 'Professionals · Presentation · Speaking', rate: '$20 / hour' },
]

function Teachers() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-extrabold text-xl text-white">GEN</div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">GLOBALENGLISH NEWS</span>
              <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase block">READ · THINK · SPEAK</span>
            </div>
          </Link>
          <Link to="/" className="text-xs font-bold text-slate-300 hover:text-white">Back to GEN</Link>
        </div>
      </header>

      <main>
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} /> Verified Teacher Network
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5">Learn with a real teacher.</h1>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              GEN connects English learners with certified ESL teachers for focused speaking practice, tutoring, IELTS preparation, and local lessons.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <a href="#find" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm inline-flex items-center justify-center gap-2">Find a Teacher <ArrowRight size={16} /></a>
              <a href="#join" className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 font-bold text-sm">Join as a Teacher</a>
            </div>
          </div>
        </section>

        <section className="py-14 px-4 border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              [MessageCircle, '30-minute speaking', 'Turn the article you just read into a real conversation with an English teacher.'],
              [MapPin, 'Local connections', 'Find teachers offering online or in-person English support in your area.'],
              [BadgeCheck, 'Teacher profiles', 'See certifications, specialties, format, location, and teaching focus before booking.'],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof MessageCircle
              return <div key={title as string} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <I className="text-blue-400 mb-4" size={22} />
                <h2 className="font-bold text-white mb-2">{title as string}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{copy as string}</p>
              </div>
            })}
          </div>
        </section>

        <section id="find" className="py-16 px-4 bg-slate-900/50 border-y border-slate-800/80">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest font-bold text-blue-400">Teacher marketplace · MVP</p>
              <h2 className="text-3xl font-extrabold mt-2">Find your English teacher</h2>
              <p className="text-slate-400 mt-2 text-sm">These are placeholder profiles for the prototype. Verified teacher profiles and live availability come next.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sampleTeachers.map((teacher) => (
                <article key={teacher.name + teacher.specialties} className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4"><Users size={20} /></div>
                  <div className="flex items-center gap-2"><h3 className="font-bold">{teacher.name}</h3><BadgeCheck size={15} className="text-emerald-400" /></div>
                  <p className="text-xs text-slate-500 mt-1">{teacher.specialties}</p>
                  <div className="mt-5 space-y-2 text-xs text-slate-300">
                    <div className="flex gap-2"><Globe2 size={14} className="text-blue-400" />{teacher.mode}</div>
                    <div className="flex gap-2"><MapPin size={14} className="text-blue-400" />{teacher.location}</div>
                    <div className="flex gap-2"><CalendarDays size={14} className="text-blue-400" />{teacher.rate}</div>
                  </div>
                  <button className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold">Request a Session</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="py-16 px-4">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-emerald-400">For certified ESL teachers</p>
              <h2 className="text-3xl font-extrabold mt-2">Bring your teaching to GEN.</h2>
              <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                Build a professional profile, receive online speaking-session opportunities, and eventually receive qualified local tutoring and business-training referrals through GEN.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p>✓ Certified teacher profile</p>
                <p>✓ Online 30-minute speaking opportunities</p>
                <p>✓ Online and local referral opportunities</p>
                <p>✓ GEN-managed booking and payment flow as the marketplace launches</p>
              </div>
            </div>

            <form className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
              {submitted ? (
                <div className="py-10 text-center">
                  <Sparkles className="mx-auto text-emerald-400 mb-4" size={28} />
                  <h3 className="font-bold text-xl">Interest registered.</h3>
                  <p className="text-sm text-slate-400 mt-2">The next build will connect this form to teacher accounts, verification, and onboarding.</p>
                </div>
              ) : <>
                <h3 className="font-bold text-lg">Join the teacher network</h3>
                <input required placeholder="Full name" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
                <input required type="email" placeholder="Email address" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
                <input required placeholder="Certification (e.g. CELTA, TEFL, TESOL)" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
                <input required placeholder="Country / city" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm">
                  <option>Online teaching</option><option>In-person teaching</option><option>Both</option>
                </select>
                <button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 font-bold text-sm">Apply to Join GEN</button>
              </>}
            </form>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-900/50 border-t border-slate-800/80">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-extrabold">The GEN learning loop</h2>
            <p className="text-slate-400 text-sm mt-3">Read → Think → Speak → Learn with a teacher → Keep learning.</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-6 text-blue-400 font-bold text-sm">Create a lesson <ArrowRight size={15} /></Link>
          </div>
        </section>
      </main>
    </div>
  )
}
