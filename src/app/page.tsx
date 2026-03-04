import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dumbbell, Zap, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-violet-400" />
          <span className="text-xl font-bold">LetsWorkOut</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">
              Get started free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Zap className="h-3.5 w-3.5" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Your AI Personal
          <span className="text-violet-400"> Trainer</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Describe your goals in plain English. Get a science-backed, personalized workout plan in seconds. Track every rep, crush every PR.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white px-8">
              Build my first workout
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Zap className="h-6 w-6 text-violet-400" />,
            title: "AI Workout Generation",
            desc: "Describe your goal — \"marathon training, 4 days/week\" — and get a full structured plan instantly.",
          },
          {
            icon: <Dumbbell className="h-6 w-6 text-emerald-400" />,
            title: "Manual Builder",
            desc: "Pick exercises from our library, set your sets/reps/rest, and drag to reorder. Full control.",
          },
          {
            icon: <TrendingUp className="h-6 w-6 text-sky-400" />,
            title: "Progress Tracking",
            desc: "Auto-detect personal records, track volume over time, and maintain your workout streak.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20">
        <h2 className="text-3xl font-bold mb-4">Ready to start training smarter?</h2>
        <p className="text-slate-400 mb-8">Free to start. No credit card required.</p>
        <Link href="/signup">
          <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white px-10">
            Create free account
          </Button>
        </Link>
      </section>

      <footer className="text-center py-8 text-slate-500 text-sm border-t border-white/5">
        © {new Date().getFullYear()} LetsWorkOut. Built with Claude AI.
      </footer>
    </div>
  )
}
