import { useState, useEffect } from 'react'
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, Circle, Code } from 'lucide-react'

const lessons = [
  {
    id: 1,
    title: 'What is CI/CD?',
    duration: '5 min',
    level: 'Beginner',
    sections: [
      {
        type: 'text',
        content: 'CI/CD stands for Continuous Integration and Continuous Delivery (or Deployment). It is the practice of automating the steps between writing code and running it in production.',
      },
      {
        type: 'heading',
        content: 'Continuous Integration (CI)',
      },
      {
        type: 'text',
        content: 'Developers merge code changes frequently — daily or even multiple times per day. Every merge automatically triggers a build and runs all tests. This catches bugs early, before they pile up and become expensive to fix.',
      },
      {
        type: 'heading',
        content: 'Continuous Delivery (CD)',
      },
      {
        type: 'text',
        content: 'After CI passes, the code is automatically packaged and ready to deploy to production at any moment. A human still makes the final decision to push it live — but the process is fully automated up to that point.',
      },
      {
        type: 'heading',
        content: 'Continuous Deployment',
      },
      {
        type: 'text',
        content: 'Goes one step further: every change that passes all tests is automatically deployed to production — no human approval needed. Used by companies like Netflix and Amazon to ship hundreds of times per day.',
      },
      {
        type: 'heading',
        content: 'The Pipeline Flow',
      },
      {
        type: 'list',
        items: [
          'Source — developer pushes code to Git',
          'Build — code is compiled or bundled',
          'Test — automated tests run (unit, integration, E2E)',
          'Package — a deployable artifact is created (Docker image, .zip, etc.)',
          'Deploy — artifact is pushed to staging or production',
          'Monitor — errors and performance are tracked in production',
        ],
      },
      {
        type: 'callout',
        content: 'Each stage is a gate. Code only moves to the next stage if the previous one succeeds. This is why CI/CD is so powerful — broken code cannot reach production.',
      },
    ],
  },
  {
    id: 2,
    title: 'Pipeline stages explained',
    duration: '8 min',
    level: 'Beginner',
    sections: [
      {
        type: 'text',
        content: 'A CI/CD pipeline is made up of stages that each serve a specific purpose. Understanding each stage helps you design reliable, fast pipelines.',
      },
      { type: 'heading', content: '1. Source Stage' },
      {
        type: 'text',
        content: 'The pipeline starts when code is pushed to a branch (e.g. main, feature/login) or when a pull request is opened. Tools: GitHub, GitLab, Bitbucket, Azure Repos.',
      },
      { type: 'heading', content: '2. Build Stage' },
      {
        type: 'text',
        content: 'Your code is compiled or transpiled, and dependencies are installed. For a Node.js project this looks like:',
      },
      {
        type: 'code',
        lang: 'bash',
        content: 'npm install\nnpm run build',
      },
      { type: 'heading', content: '3. Test Stage' },
      {
        type: 'text',
        content: 'Automated tests run in order: unit tests first (fastest), then integration tests, then end-to-end tests (slowest). If any test fails, the pipeline stops here — the bug is caught before it ships.',
      },
      { type: 'heading', content: '4. Security Scan Stage' },
      {
        type: 'text',
        content: 'Scans for known vulnerabilities in dependencies and checks for secrets accidentally committed to code. Popular tools:',
      },
      {
        type: 'list',
        items: ['Snyk — dependency vulnerability scanning', 'Trivy — container image scanning', 'SonarQube — static code analysis', 'GitLeaks — secret detection in commits'],
      },
      { type: 'heading', content: '5. Package Stage' },
      {
        type: 'text',
        content: 'Creates the deployable artifact. For modern applications this is usually a Docker image:',
      },
      {
        type: 'code',
        lang: 'bash',
        content: 'docker build -t myapp:$GIT_SHA .\ndocker push registry.example.com/myapp:$GIT_SHA',
      },
      { type: 'heading', content: '6. Deploy Stage' },
      {
        type: 'text',
        content: 'Pushes the artifact to a server or cloud environment. Common deployment strategies:',
      },
      {
        type: 'list',
        items: [
          'Rolling — gradually replace old instances with new ones',
          'Blue-Green — run two identical environments, switch traffic instantly',
          'Canary — send 5% of traffic to new version first, watch for errors',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'GitHub Actions basics',
    duration: '10 min',
    level: 'Beginner',
    sections: [
      {
        type: 'text',
        content: 'GitHub Actions is the most popular CI/CD tool today. It is built directly into GitHub — free for public repos, and 2000 minutes/month free for private repos.',
      },
      { type: 'heading', content: 'Key Concepts' },
      {
        type: 'list',
        items: [
          'Workflow — a YAML file that defines your entire pipeline, stored in .github/workflows/',
          'Trigger (on:) — what starts the pipeline: push, pull_request, schedule, manual',
          'Job — a group of steps that run together on one machine',
          'Step — a single command (run:) or pre-built action (uses:)',
          'Runner — the virtual machine that runs your job (ubuntu-latest, windows-latest, macos-latest)',
          'Action — a reusable unit of code from the GitHub Marketplace (e.g. actions/checkout)',
        ],
      },
      { type: 'heading', content: 'Your First Workflow' },
      {
        type: 'text',
        content: 'Create this file at .github/workflows/ci.yml in your repository:',
      },
      {
        type: 'code',
        lang: 'yaml',
        content: `name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build`,
      },
      { type: 'heading', content: 'How to Read This File' },
      {
        type: 'list',
        items: [
          'on: push/pull_request — runs whenever code is pushed to main or a PR is opened',
          'runs-on: ubuntu-latest — GitHub spins up a fresh Ubuntu VM for each run',
          'uses: actions/checkout@v4 — checks out your repository code onto the runner',
          'uses: actions/setup-node@v4 — installs Node.js (with built-in npm caching)',
          'run: npm ci — installs exact package versions from package-lock.json',
        ],
      },
      {
        type: 'callout',
        content: 'That is it! Commit this file and GitHub will automatically run your pipeline on every push. View the results in the Actions tab of your repository.',
      },
    ],
  },
  {
    id: 4,
    title: 'Secrets & environment variables',
    duration: '6 min',
    level: 'Beginner',
    sections: [
      {
        type: 'text',
        content: 'Pipelines often need sensitive values: API keys, database URLs, deployment tokens. Never hardcode these in your YAML files — they would be visible to anyone who can read the repository.',
      },
      { type: 'heading', content: 'GitHub Actions Secrets' },
      {
        type: 'text',
        content: 'Store sensitive values in GitHub: go to your repo → Settings → Secrets and variables → Actions → New repository secret.',
      },
      {
        type: 'text',
        content: 'Reference them in your workflow like this:',
      },
      {
        type: 'code',
        lang: 'yaml',
        content: `steps:
  - name: Deploy to server
    env:
      DATABASE_URL: \${{ secrets.DATABASE_URL }}
      API_KEY: \${{ secrets.API_KEY }}
    run: ./deploy.sh`,
      },
      { type: 'heading', content: 'Environment Variables' },
      {
        type: 'text',
        content: 'Non-sensitive config values can be set as environment variables at the workflow, job, or step level:',
      },
      {
        type: 'code',
        lang: 'yaml',
        content: `env:
  NODE_ENV: production
  PORT: 3000

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      DEPLOY_TARGET: staging  # job-level override`,
      },
      { type: 'heading', content: 'Built-in Variables' },
      {
        type: 'list',
        items: [
          'github.sha — the full commit SHA that triggered the run',
          'github.ref — the branch or tag ref (refs/heads/main)',
          'github.actor — the username that triggered the workflow',
          'github.repository — owner/repo-name',
          'runner.os — the OS of the runner (Linux, Windows, macOS)',
        ],
      },
      {
        type: 'callout',
        content: 'Secrets are masked in logs — if a secret value appears in output, GitHub replaces it with ***. Never echo or print secrets directly.',
      },
    ],
  },
  {
    id: 5,
    title: 'Caching & speed optimisation',
    duration: '7 min',
    level: 'Intermediate',
    sections: [
      {
        type: 'text',
        content: 'Slow pipelines kill developer momentum. The single biggest win is caching — skipping work you have already done. A pipeline that takes 8 minutes can often be cut to 90 seconds with proper caching.',
      },
      { type: 'heading', content: 'Cache npm Dependencies' },
      {
        type: 'text',
        content: 'actions/setup-node has caching built in — just set cache: npm:',
      },
      {
        type: 'code',
        lang: 'yaml',
        content: `- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'   # caches ~/.npm automatically`,
      },
      { type: 'heading', content: 'Custom Cache with actions/cache' },
      {
        type: 'code',
        lang: 'yaml',
        content: `- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-`,
      },
      {
        type: 'text',
        content: 'The key uses a hash of package-lock.json — so the cache is invalidated automatically whenever dependencies change.',
      },
      { type: 'heading', content: 'Parallelise Jobs' },
      {
        type: 'text',
        content: 'Run independent jobs at the same time instead of sequentially:',
      },
      {
        type: 'code',
        lang: 'yaml',
        content: `jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit

  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - run: npm run typecheck

  # This job waits for all three above
  build:
    needs: [unit-tests, lint, type-check]
    runs-on: ubuntu-latest
    steps:
      - run: npm run build`,
      },
      { type: 'heading', content: 'CI/CD Speed Rules' },
      {
        type: 'list',
        items: [
          'Always cache dependencies — never re-download node_modules from scratch',
          'Fail fast — run the cheapest checks first (lint, type-check) before slow tests',
          'Parallelise — independent jobs should run simultaneously',
          'Skip unchanged paths — use paths: filter to skip CI when only docs change',
          'Target under 10 minutes — long pipelines get ignored or bypassed',
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'CI/CD best practices',
    duration: '7 min',
    level: 'Intermediate',
    sections: [
      {
        type: 'text',
        content: 'These are the practices that separate a reliable pipeline from one that gets disabled because it is too painful to deal with.',
      },
      { type: 'heading', content: '1. Keep Pipelines Under 10 Minutes' },
      {
        type: 'text',
        content: 'If CI takes 30+ minutes, developers start pushing directly to main or bypassing checks. Cache aggressively, parallelise jobs, and cut tests that are too slow.',
      },
      { type: 'heading', content: '2. Never Hardcode Secrets' },
      {
        type: 'text',
        content: 'Use repository or organisation secrets. Rotate any secret that was accidentally committed — treat it as compromised immediately.',
      },
      { type: 'heading', content: '3. Protect the Main Branch' },
      {
        type: 'text',
        content: 'In GitHub: Settings → Branches → Add rule. Require status checks to pass before merging. This makes CI a hard gate, not a suggestion.',
      },
      { type: 'heading', content: '4. Test in a Branch First' },
      {
        type: 'text',
        content: 'Never experiment with pipeline changes directly on main. Create a test-ci branch, push it, watch the Actions tab, iterate — then merge once it is working.',
      },
      { type: 'heading', content: '5. Make Deployments Reversible' },
      {
        type: 'text',
        content: 'Always have a rollback plan. Tag every Docker image with the Git SHA so you can redeploy any previous version instantly:',
      },
      {
        type: 'code',
        lang: 'bash',
        content: 'docker tag myapp:latest myapp:${{ github.sha }}\n# To rollback: deploy myapp:<previous-sha>',
      },
      { type: 'heading', content: '6. Monitor After Every Deploy' },
      {
        type: 'text',
        content: 'Deployment is not the end. Connect your CD tool to monitoring (Datadog, Grafana, Sentry) and set up automatic rollback if error rates spike within 5 minutes of a deploy.',
      },
      {
        type: 'callout',
        content: 'A pipeline that catches 0 bugs is not a good pipeline — it is untested. Make sure your test suite actually covers the code paths that matter.',
      },
    ],
  },
]

function ContentRenderer({ sections }) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => {
        switch (section.type) {
          case 'heading':
            return (
              <h3 key={i} className="text-white font-bold text-lg mt-8 mb-2 first:mt-0 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-400 rounded-full inline-block flex-shrink-0" />
                {section.content}
              </h3>
            )
          case 'text':
            return (
              <p key={i} className="text-slate-300 leading-relaxed">
                {section.content}
              </p>
            )
          case 'list':
            return (
              <ul key={i} className="space-y-2">
                {section.items.map((item, j) => {
                  const [bold, ...rest] = item.split(' — ')
                  const hasDash = item.includes(' — ')
                  return (
                    <li key={j} className="flex items-start gap-2.5 text-slate-300">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                      <span>
                        {hasDash ? (
                          <>
                            <span className="text-white font-medium">{bold}</span>
                            {' — '}
                            {rest.join(' — ')}
                          </>
                        ) : item}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )
          case 'code':
            return (
              <div key={i} className="bg-slate-950 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/30">
                  <Code size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-400 font-mono">{section.lang}</span>
                </div>
                <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre">
                  {section.content}
                </pre>
              </div>
            )
          case 'callout':
            return (
              <div key={i} className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 text-indigo-200 text-sm leading-relaxed">
                <span className="font-semibold text-indigo-300">Key insight: </span>
                {section.content}
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

const STORAGE_KEY = 'pipelinehub_completed'

export default function Learn() {
  const [active, setActive] = useState(lessons[0])
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const toggleComplete = (id) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const activeIndex = lessons.findIndex(l => l.id === active.id)
  const prev = lessons[activeIndex - 1]
  const next = lessons[activeIndex + 1]

  const progressPct = Math.round((completed.length / lessons.length) * 100)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Learn CI/CD</h1>
        <p className="text-slate-400 mb-4">Step-by-step lessons from zero to production-ready pipelines.</p>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-slate-400 text-sm whitespace-nowrap">
            {completed.length}/{lessons.length} complete
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lesson list */}
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const done = completed.includes(lesson.id)
            return (
              <button
                key={lesson.id}
                onClick={() => setActive(lesson)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  active.id === lesson.id
                    ? 'bg-indigo-600/20 border-indigo-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium text-sm ${active.id === lesson.id ? 'text-white' : 'text-slate-300'}`}>
                    {lesson.title}
                  </span>
                  {done
                    ? <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                    : <ChevronRight size={15} className="text-slate-500 flex-shrink-0" />
                  }
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    lesson.level === 'Beginner' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                  }`}>{lesson.level}</span>
                  <span>{lesson.duration}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Lesson content */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="text-indigo-400" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{active.title}</h2>
                <div className="flex gap-3 text-sm text-slate-400 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    active.level === 'Beginner' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                  }`}>{active.level}</span>
                  <span>{active.duration} read</span>
                </div>
              </div>
            </div>
          </div>

          <ContentRenderer sections={active.sections} />

          {/* Footer actions */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => toggleComplete(active.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                completed.includes(active.id)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-slate-300 border border-white/15 hover:bg-white/10'
              }`}
            >
              {completed.includes(active.id)
                ? <><CheckCircle size={16} /> Completed</>
                : <><Circle size={16} /> Mark as complete</>
              }
            </button>

            <div className="flex gap-3">
              {prev && (
                <button
                  onClick={() => setActive(prev)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              )}
              {next && (
                <button
                  onClick={() => { setActive(next); toggleComplete(active.id) }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Next lesson <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
