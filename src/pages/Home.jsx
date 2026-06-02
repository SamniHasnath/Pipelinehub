import { Link } from 'react-router-dom'
import { ArrowRight, Zap, BookOpen, Wrench, Map, GitBranch, Shield, Clock, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: BookOpen,
    title: 'Learn CI/CD',
    desc: 'Interactive lessons with real YAML examples. From "What is CI?" to advanced GitOps patterns.',
    to: '/learn',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    highlight: 'bg-blue-500/20',
  },
  {
    icon: Zap,
    title: 'Pipeline Builder',
    desc: 'Click to add stages, pick your platform, and get a ready-to-use YAML file instantly.',
    to: '/builder',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    highlight: 'bg-yellow-500/20',
  },
  {
    icon: Wrench,
    title: 'Tools Explorer',
    desc: 'GitHub Actions, Jenkins, GitLab CI, CircleCI, ArgoCD — compared by pricing, speed, and use case.',
    to: '/tools',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    highlight: 'bg-green-500/20',
  },
  {
    icon: Map,
    title: 'Skill Roadmap',
    desc: 'Track your progress from complete beginner to DevOps professional. Check off skills as you learn.',
    to: '/roadmap',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    highlight: 'bg-purple-500/20',
  },
]

const stats = [
  { label: 'CI/CD Tools covered', value: '12+', icon: Wrench },
  { label: 'Pipeline templates', value: '30+', icon: Zap },
  { label: 'Interactive lessons', value: '15+', icon: BookOpen },
  { label: '100% Free forever', value: '✓', icon: Shield },
]

const pipelineStages = [
  { label: 'Source', color: 'bg-blue-500', desc: 'Code push triggers the pipeline' },
  { label: 'Build', color: 'bg-indigo-500', desc: 'Compile code, install dependencies' },
  { label: 'Test', color: 'bg-purple-500', desc: 'Unit, integration & E2E tests' },
  { label: 'Scan', color: 'bg-pink-500', desc: 'Security & vulnerability checks' },
  { label: 'Package', color: 'bg-orange-500', desc: 'Create Docker image or artifact' },
  { label: 'Deploy', color: 'bg-green-500', desc: 'Ship to staging or production' },
]

const faqs = [
  {
    q: 'What is CI/CD?',
    a: 'CI (Continuous Integration) means developers merge code often and every merge automatically runs tests. CD (Continuous Delivery/Deployment) means passing code is automatically prepared — or even deployed — to production. Together they eliminate manual, error-prone release processes.',
  },
  {
    q: 'Which CI/CD tool should I learn first?',
    a: 'Start with GitHub Actions if you use GitHub. It\'s built-in, free for public repos, has the largest marketplace of reusable actions, and the YAML syntax is straightforward. Once you understand the concepts, every other tool is easy to pick up.',
  },
  {
    q: 'Do I need to know Docker to use CI/CD?',
    a: 'No — but it helps. Many pipelines run directly on the runner machine without Docker. Once you\'re comfortable with pipelines, adding Docker lets you containerize your builds and deployments for consistency across environments.',
  },
  {
    q: 'How long does it take to set up a basic pipeline?',
    a: 'For a simple Node.js or Python project with GitHub Actions: under 10 minutes. You create one YAML file in .github/workflows/ and commit it. Use our Pipeline Builder to generate the YAML automatically.',
  },
]

export default function Home() {
  const [activeStage, setActiveStage] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(s => (s + 1) % pipelineStages.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Free CI/CD Learning Platform — No sign-up required
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Master{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              CI/CD Pipelines
            </span>
            <br />
            From Zero to Production
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Learn how automated pipelines work, build your own with a visual editor,
            compare every major tool, and track your progress — all in one place.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Covers GitHub Actions · GitLab CI · Jenkins · Docker · ArgoCD · Kubernetes
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/learn"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              Start Learning Free <ArrowRight size={20} />
            </Link>
            <Link
              to="/builder"
              className="flex items-center gap-2 border border-white/20 hover:border-indigo-400/60 hover:bg-white/5 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Build a Pipeline
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pipeline Flow Animation ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">How a CI/CD Pipeline Works</h2>
          <p className="text-slate-400">Every code push flows through these automated stages</p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-2 md:gap-0 bg-white/3 border border-white/10 rounded-2xl p-6 md:p-8 overflow-x-auto">
          {pipelineStages.map((stage, i) => (
            <div key={stage.label} className="flex flex-col md:flex-row items-center flex-1 min-w-0">
              <button
                onClick={() => setActiveStage(i)}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all w-full md:w-auto ${
                  activeStage === i
                    ? 'bg-white/10 scale-105 shadow-lg'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 ${stage.color} rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg`}>
                  {i + 1}
                </div>
                <span className={`font-semibold text-sm transition-colors ${activeStage === i ? 'text-white' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
              </button>
              {i < pipelineStages.length - 1 && (
                <div className={`w-0.5 md:w-8 h-6 md:h-0.5 mx-auto md:mx-0 flex-shrink-0 transition-colors ${
                  activeStage > i ? 'bg-indigo-400' : 'bg-white/15'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center min-h-[48px]">
          <div className="inline-block bg-white/5 border border-white/10 rounded-xl px-6 py-3">
            <span className="font-semibold text-white">{pipelineStages[activeStage].label}: </span>
            <span className="text-slate-300">{pipelineStages[activeStage].desc}</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/10 bg-white/3">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="text-indigo-400" size={22} />
              <div className="text-3xl font-extrabold text-white">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to master CI/CD</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Four tools in one platform — learn the concepts, build real pipelines, compare tools, and track your skills.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, to, color, bg }) => (
            <Link
              key={to}
              to={to}
              className={`group border ${bg} rounded-2xl p-8 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 flex gap-5`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5`}>
                <Icon className={color} size={26} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
                <div className={`flex items-center gap-1.5 mt-4 text-sm font-medium ${color} group-hover:gap-2.5 transition-all`}>
                  Explore <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why PipelineHub ── */}
      <section className="bg-white/3 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Why learn CI/CD now?</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                CI/CD is no longer optional — it's expected in every software engineering role.
                Companies run hundreds of pipeline executions per day. Understanding how they
                work makes you a significantly better developer and opens doors to DevOps and
                platform engineering careers.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Save hours every release — no more manual deployments' },
                  { icon: Shield, text: 'Catch bugs before they reach users, automatically' },
                  { icon: Users, text: 'Collaborate safely — every PR is tested before merge' },
                  { icon: GitBranch, text: 'Required skill in 80%+ of senior engineering job postings' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-indigo-400" size={16} />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini code block */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-slate-400 text-xs ml-2">.github/workflows/ci.yml</span>
              </div>
              <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
                <span className="text-slate-500"># Runs on every push to main</span>{'\n'}
                <span className="text-purple-400">name</span>
                <span className="text-white">: </span>
                <span className="text-green-300">CI Pipeline</span>{'\n\n'}
                <span className="text-purple-400">on</span>
                <span className="text-white">:</span>{'\n'}
                <span className="text-white">  </span>
                <span className="text-purple-400">push</span>
                <span className="text-white">:</span>{'\n'}
                <span className="text-white">    </span>
                <span className="text-purple-400">branches</span>
                <span className="text-white">: [</span>
                <span className="text-green-300">main</span>
                <span className="text-white">]</span>{'\n\n'}
                <span className="text-purple-400">jobs</span>
                <span className="text-white">:</span>{'\n'}
                <span className="text-white">  </span>
                <span className="text-purple-400">test</span>
                <span className="text-white">:</span>{'\n'}
                <span className="text-white">    </span>
                <span className="text-purple-400">runs-on</span>
                <span className="text-white">: </span>
                <span className="text-green-300">ubuntu-latest</span>{'\n'}
                <span className="text-white">    </span>
                <span className="text-purple-400">steps</span>
                <span className="text-white">:</span>{'\n'}
                <span className="text-white">      - </span>
                <span className="text-purple-400">uses</span>
                <span className="text-white">: </span>
                <span className="text-green-300">actions/checkout@v4</span>{'\n'}
                <span className="text-white">      - </span>
                <span className="text-purple-400">run</span>
                <span className="text-white">: </span>
                <span className="text-yellow-300">npm test</span>
                <span className="text-green-400 block mt-3 text-xs">✓ All tests passed in 43s</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Common questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-white">{faq.q}</span>
                <span className={`text-indigo-400 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-slate-400 leading-relaxed border-t border-white/10 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to ship faster?</h2>
          <p className="text-indigo-200 mb-8 max-w-md mx-auto">
            Start with Lesson 1 — "What is CI/CD?" takes 5 minutes and changes how you think about software delivery.
          </p>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            Start Learning Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
