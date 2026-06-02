import { useState, useEffect } from 'react'
import { CheckCircle, Circle, Lock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const roadmap = [
  {
    level: 'Beginner',
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    barColor: 'bg-green-500',
    steps: [
      {
        id: 'b1',
        title: 'What is CI/CD?',
        desc: 'Understand the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment. Know why it matters.',
        resource: '/learn',
        resourceLabel: 'Lesson 1 →',
        time: '30 min',
      },
      {
        id: 'b2',
        title: 'Git basics',
        desc: 'Commits, branches, pull requests, and merges. CI/CD triggers on Git events — you must be comfortable with the basics.',
        time: '1 hour',
      },
      {
        id: 'b3',
        title: 'Create a GitHub account',
        desc: 'Sign up at github.com and create your first repository. Push a simple project.',
        time: '15 min',
      },
      {
        id: 'b4',
        title: 'Your first GitHub Actions pipeline',
        desc: 'Write a simple .github/workflows/ci.yml that runs on push and executes a test command.',
        resource: '/learn',
        resourceLabel: 'Lesson 3 →',
        time: '45 min',
      },
      {
        id: 'b5',
        title: 'Run automated tests in CI',
        desc: 'Add a test command to your pipeline. Understand how a failing test stops a pipeline.',
        time: '1 hour',
      },
      {
        id: 'b6',
        title: 'Understand pipeline stages',
        desc: 'Learn what Source, Build, Test, Package, and Deploy stages do and why the order matters.',
        resource: '/learn',
        resourceLabel: 'Lesson 2 →',
        time: '30 min',
      },
    ],
  },
  {
    level: 'Intermediate',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    barColor: 'bg-yellow-500',
    steps: [
      {
        id: 'i1',
        title: 'Environment variables & secrets',
        desc: 'Store sensitive config (API keys, tokens) in GitHub Secrets. Reference them safely in workflows.',
        resource: '/learn',
        resourceLabel: 'Lesson 4 →',
        time: '45 min',
      },
      {
        id: 'i2',
        title: 'Caching dependencies',
        desc: 'Cache node_modules, pip packages, or Maven artifacts between runs to cut build times from 5 min to 30 sec.',
        resource: '/learn',
        resourceLabel: 'Lesson 5 →',
        time: '1 hour',
      },
      {
        id: 'i3',
        title: 'Parallel jobs',
        desc: 'Run unit tests, lint, and type-check simultaneously. Use needs: to define dependencies between jobs.',
        time: '1 hour',
      },
      {
        id: 'i4',
        title: 'Docker fundamentals',
        desc: 'Build a Docker image, run a container locally. Understand layers, Dockerfile, and image tagging.',
        time: '3 hours',
      },
      {
        id: 'i5',
        title: 'Build & push Docker images in CI',
        desc: 'Use docker/build-push-action to build and push images to GitHub Container Registry (ghcr.io) automatically.',
        time: '2 hours',
      },
      {
        id: 'i6',
        title: 'Branch strategies',
        desc: 'Learn Git Flow vs trunk-based development. Understand feature branches, PRs, and deployment gates.',
        time: '1 hour',
      },
      {
        id: 'i7',
        title: 'Deploy to a cloud server',
        desc: 'Deploy a containerised app to a VPS (DigitalOcean, AWS EC2) via SSH in a pipeline.',
        time: '3 hours',
      },
    ],
  },
  {
    level: 'Advanced',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    barColor: 'bg-purple-500',
    steps: [
      {
        id: 'a1',
        title: 'GitOps with ArgoCD',
        desc: 'Declare desired cluster state in Git. ArgoCD continuously syncs your Kubernetes cluster to match.',
        time: '4 hours',
      },
      {
        id: 'a2',
        title: 'Kubernetes fundamentals',
        desc: 'Pods, Deployments, Services, ConfigMaps, Namespaces. Learn to deploy and update apps on a cluster.',
        time: '8 hours',
      },
      {
        id: 'a3',
        title: 'DevSecOps — shift-left security',
        desc: 'Add SAST (Snyk, SonarQube), container scanning (Trivy), and secret detection (GitLeaks) to pipelines.',
        time: '3 hours',
      },
      {
        id: 'a4',
        title: 'Blue-green & canary deployments',
        desc: 'Ship with zero downtime. Route traffic progressively to new versions. Rollback in seconds.',
        time: '3 hours',
      },
      {
        id: 'a5',
        title: 'Pipeline observability',
        desc: 'Track pipeline metrics: success rate, duration trends, flaky tests. Use Grafana or Datadog.',
        time: '2 hours',
      },
      {
        id: 'a6',
        title: 'Multi-environment CD',
        desc: 'Promote builds through dev → staging → production environments with approval gates.',
        time: '4 hours',
      },
    ],
  },
]

const STORAGE_KEY = 'pipelinehub_roadmap'

export default function Roadmap() {
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done))
  }, [done])

  const toggle = (id) => setDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const totalSteps = roadmap.reduce((sum, s) => sum + s.steps.length, 0)
  const totalDone = done.length
  const overallPct = Math.round((totalDone / totalSteps) * 100)

  const levelUnlocked = (levelIndex) => {
    if (levelIndex === 0) return true
    const prevSteps = roadmap[levelIndex - 1].steps
    const prevDone = prevSteps.filter(s => done.includes(s.id)).length
    return prevDone >= Math.ceil(prevSteps.length * 0.7)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Skill Roadmap</h1>
        <p className="text-slate-400 mb-6">Your path from CI/CD beginner to DevOps professional. Click any skill to mark it done.</p>

        {/* Overall progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Overall Progress</span>
            <span className="text-2xl font-bold text-white">{overallPct}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{totalDone} of {totalSteps} skills complete</span>
            {totalDone === totalSteps && <span className="text-green-400 font-semibold">🎉 Roadmap complete!</span>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {roadmap.map((section, sectionIdx) => {
          const unlocked = levelUnlocked(sectionIdx)
          const sectionDone = section.steps.filter(s => done.includes(s.id)).length
          const sectionPct = Math.round((sectionDone / section.steps.length) * 100)

          return (
            <div
              key={section.level}
              className={`border ${section.border} ${section.bg} rounded-2xl overflow-hidden transition-opacity ${!unlocked ? 'opacity-50' : ''}`}
            >
              {/* Section header */}
              <div className="p-5 pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold ${section.color}`}>{section.level}</h2>
                    {!unlocked && (
                      <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        🔒 Complete 70% of previous level to unlock
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-400">{sectionDone}/{section.steps.length}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-5">
                  <div
                    className={`h-full ${section.barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${sectionPct}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="px-5 pb-5 space-y-2">
                {section.steps.map((step) => {
                  const isDone = done.includes(step.id)
                  const isOpen = expanded[step.id]

                  return (
                    <div
                      key={step.id}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        isDone
                          ? 'bg-white/8 border-white/15'
                          : 'bg-white/3 border-white/8 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <button
                          onClick={() => unlocked && toggle(step.id)}
                          disabled={!unlocked}
                          className="flex-shrink-0 transition-transform hover:scale-110"
                        >
                          {isDone
                            ? <CheckCircle className="text-green-400" size={20} />
                            : unlocked
                              ? <Circle className="text-slate-500 hover:text-slate-300" size={20} />
                              : <Lock className="text-slate-700" size={20} />
                          }
                        </button>

                        <button
                          onClick={() => toggleExpand(step.id)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-sm ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                              {step.title}
                            </span>
                            <div className="flex items-center gap-2 ml-2">
                              <span className="text-xs text-slate-500 whitespace-nowrap">{step.time}</span>
                              {isOpen
                                ? <ChevronUp size={14} className="text-slate-500" />
                                : <ChevronDown size={14} className="text-slate-500" />
                              }
                            </div>
                          </div>
                        </button>
                      </div>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-white/8">
                          <p className="text-slate-400 text-sm leading-relaxed mb-3">{step.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Estimated time: {step.time}</span>
                            {step.resource && (
                              <a
                                href={step.resource}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                              >
                                {step.resourceLabel}
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {totalDone > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => { if (window.confirm('Reset all progress?')) setDone([]) }}
            className="text-sm text-slate-600 hover:text-slate-400 transition-colors"
          >
            Reset progress
          </button>
        </div>
      )}
    </div>
  )
}
