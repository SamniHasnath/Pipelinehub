import { useState } from 'react'
import { Plus, Copy, Check, Download, Info } from 'lucide-react'
import PipelineStage from '../components/PipelineStage'

const stageTypes = [
  { id: 'checkout',  label: 'Checkout code',      color: 'bg-blue-500/20   border-blue-500/40   text-blue-300',   icon: '📥' },
  { id: 'install',   label: 'Install deps',        color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', icon: '📦' },
  { id: 'lint',      label: 'Lint code',           color: 'bg-slate-500/20  border-slate-500/40  text-slate-300',  icon: '🔍' },
  { id: 'test',      label: 'Run tests',           color: 'bg-green-500/20  border-green-500/40  text-green-300',  icon: '✅' },
  { id: 'build',     label: 'Build',               color: 'bg-purple-500/20 border-purple-500/40 text-purple-300', icon: '🔨' },
  { id: 'security',  label: 'Security scan',       color: 'bg-red-500/20    border-red-500/40    text-red-300',    icon: '🛡️' },
  { id: 'docker',    label: 'Docker build & push', color: 'bg-cyan-500/20   border-cyan-500/40   text-cyan-300',   icon: '🐳' },
  { id: 'deploy',    label: 'Deploy',              color: 'bg-orange-500/20 border-orange-500/40 text-orange-300', icon: '🚀' },
]

const platforms = {
  github: {
    label: 'GitHub Actions',
    file: '.github/workflows/ci.yml',
    generateYAML: (stages, config) => {
      const steps = stages.map(s => githubStepYAML(s.id, config)).join('\n\n')
      return `name: ${config.pipelineName}

on:
  push:
    branches: [${config.branch}]
  pull_request:
    branches: [${config.branch}]

jobs:
  pipeline:
    runs-on: ubuntu-latest

    steps:
${steps}
`
    },
  },
  gitlab: {
    label: 'GitLab CI',
    file: '.gitlab-ci.yml',
    generateYAML: (stages, config) => {
      const stageNames = stages.map(s => s.id).join('\n  - ')
      const jobs = stages.map(s => gitlabJobYAML(s.id, config)).join('\n\n')
      return `stages:
  - ${stageNames}

${jobs}
`
    },
  },
  jenkins: {
    label: 'Jenkins',
    file: 'Jenkinsfile',
    generateYAML: (stages, config) => {
      const stageBlocks = stages.map(s => jenkinsStageBlock(s.id, config)).join('\n\n        ')
      return `pipeline {
  agent any

  environment {
    NODE_VERSION = '${config.nodeVersion}'
  }

  stages {
        ${stageBlocks}
  }
}
`
    },
  },
}

function githubStepYAML(id, config) {
  const map = {
    checkout: `      - name: Checkout code
        uses: actions/checkout@v4`,
    install: `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '${config.nodeVersion}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci`,
    lint: `      - name: Lint
        run: npm run lint`,
    test: `      - name: Run tests
        run: npm test`,
    build: `      - name: Build
        run: npm run build`,
    security: `      - name: Security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}`,
    docker: `      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build & push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
    deploy: `      - name: Deploy
        run: echo "Add your deploy command here"
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}`,
  }
  return map[id] || `      - name: ${id}\n        run: echo "${id}"`
}

function gitlabJobYAML(id, config) {
  const map = {
    checkout: `# GitLab CI checks out code automatically`,
    install: `install:
  stage: install
  image: node:${config.nodeVersion}
  script:
    - npm ci
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/`,
    lint: `lint:
  stage: lint
  script:
    - npm run lint`,
    test: `test:
  stage: test
  script:
    - npm test
  coverage: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/'`,
    build: `build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/`,
    security: `security:
  stage: security
  image: snyk/snyk:node
  script:
    - snyk test`,
    docker: `docker:
  stage: docker
  image: docker:24
  services:
    - docker:dind
  script:
    - docker build -t \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA .
    - docker push \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA`,
    deploy: `deploy:
  stage: deploy
  script:
    - echo "Deploy step — add your command here"
  environment:
    name: production`,
  }
  return map[id] || `${id}:\n  stage: ${id}\n  script:\n    - echo "${id}"`
}

function jenkinsStageBlock(id, config) {
  const map = {
    checkout: `stage('Checkout') {
            steps { checkout scm }
        }`,
    install: `stage('Install') {
            steps { sh 'npm ci' }
        }`,
    lint: `stage('Lint') {
            steps { sh 'npm run lint' }
        }`,
    test: `stage('Test') {
            steps { sh 'npm test' }
        }`,
    build: `stage('Build') {
            steps { sh 'npm run build' }
        }`,
    security: `stage('Security') {
            steps { sh 'snyk test' }
        }`,
    docker: `stage('Docker') {
            steps {
                sh 'docker build -t myapp:\${BUILD_NUMBER} .'
                sh 'docker push myapp:\${BUILD_NUMBER}'
            }
        }`,
    deploy: `stage('Deploy') {
            steps { sh 'echo "Add deploy command"' }
        }`,
  }
  return map[id] || `stage('${id}') {\n            steps { sh 'echo "${id}"' }\n        }`
}

export default function Builder() {
  const [platform, setPlatform] = useState('github')
  const [stages, setStages] = useState([
    { ...stageTypes[0], uid: 1 },
    { ...stageTypes[1], uid: 2 },
    { ...stageTypes[3], uid: 3 },
    { ...stageTypes[4], uid: 4 },
  ])
  const [copied, setCopied] = useState(false)
  const [config, setConfig] = useState({
    pipelineName: 'CI/CD Pipeline',
    branch: 'main',
    nodeVersion: '20',
  })

  const addStage = (type) => {
    setStages(prev => [...prev, { ...type, uid: Date.now() }])
  }

  const removeStage = (uid) => {
    setStages(prev => prev.filter(s => s.uid !== uid))
  }

  const moveStage = (uid, dir) => {
    setStages(prev => {
      const idx = prev.findIndex(s => s.uid === uid)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  const yaml = platforms[platform].generateYAML(stages, config)

  const copyYAML = () => {
    navigator.clipboard.writeText(yaml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadYAML = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = platforms[platform].file.split('/').pop()
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pipeline Builder</h1>
        <p className="text-slate-400">Choose a platform, add stages, and download your ready-to-use config file.</p>
      </div>

      {/* Platform selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {Object.entries(platforms).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPlatform(key)}
            className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              platform === key
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Builder */}
        <div className="space-y-6">
          {/* Config */}
          {platform === 'github' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="text-white font-semibold text-sm mb-3">Configuration</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Pipeline name</label>
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                    value={config.pipelineName}
                    onChange={e => setConfig(c => ({ ...c, pipelineName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Branch</label>
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                    value={config.branch}
                    onChange={e => setConfig(c => ({ ...c, branch: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Node.js version</label>
                  <select
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                    value={config.nodeVersion}
                    onChange={e => setConfig(c => ({ ...c, nodeVersion: e.target.value }))}
                  >
                    <option value="18">18 (LTS)</option>
                    <option value="20">20 (LTS)</option>
                    <option value="22">22 (latest)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Add stage buttons */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Add a stage:</h2>
            <div className="flex flex-wrap gap-2">
              {stageTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => addStage(type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${type.color}`}
                >
                  <Plus size={13} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline visual */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-3">
              Your pipeline — {stages.length} {stages.length === 1 ? 'stage' : 'stages'}
            </h2>
            <div className="space-y-1.5">
              {stages.map((stage, i) => (
                <PipelineStage
                  key={stage.uid}
                  stage={stage}
                  index={i}
                  total={stages.length}
                  onMoveUp={() => moveStage(stage.uid, -1)}
                  onMoveDown={() => moveStage(stage.uid, 1)}
                  onRemove={() => removeStage(stage.uid)}
                />
              ))}
            </div>

            {stages.length === 0 && (
              <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">
                <div className="text-3xl mb-2">+</div>
                Add a stage above to get started
              </div>
            )}
          </div>
        </div>

        {/* Right: YAML output */}
        <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded">
                {platforms[platform].file}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadYAML}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                <Download size={13} />
                Download
              </button>
              <button
                onClick={copyYAML}
                className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <pre className="p-5 text-sm text-green-300 font-mono overflow-auto flex-1 leading-relaxed whitespace-pre">
            {yaml}
          </pre>
          <div className="px-4 py-3 border-t border-white/10 bg-black/10 flex items-start gap-2">
            <Info size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              Copy this file into your repository at <span className="font-mono text-slate-400">{platforms[platform].file}</span> and commit it. The pipeline will trigger automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
