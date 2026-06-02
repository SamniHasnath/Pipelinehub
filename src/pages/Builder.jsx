import { useState, useCallback, useMemo } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Plus, Copy, Check, Download, Info, BookOpen, Code, AlertTriangle, Lightbulb, MousePointer } from 'lucide-react'
import PipelineNode from '../components/PipelineNode'

const nodeTypes = { pipeline: PipelineNode }

const stageTypes = [
  { id: 'checkout',  label: 'Checkout',       color: 'bg-blue-500/20   border-blue-500/40   text-blue-300',   icon: '📥' },
  { id: 'install',   label: 'Install deps',   color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', icon: '📦' },
  { id: 'lint',      label: 'Lint',           color: 'bg-slate-500/20  border-slate-500/40  text-slate-300',  icon: '🔍' },
  { id: 'test',      label: 'Run tests',      color: 'bg-green-500/20  border-green-500/40  text-green-300',  icon: '✅' },
  { id: 'build',     label: 'Build',          color: 'bg-purple-500/20 border-purple-500/40 text-purple-300', icon: '🔨' },
  { id: 'security',  label: 'Security scan',  color: 'bg-red-500/20    border-red-500/40    text-red-300',    icon: '🛡️' },
  { id: 'docker',    label: 'Docker',         color: 'bg-cyan-500/20   border-cyan-500/40   text-cyan-300',   icon: '🐳' },
  { id: 'deploy',    label: 'Deploy',         color: 'bg-orange-500/20 border-orange-500/40 text-orange-300', icon: '🚀' },
]

// ── Stage educational info ─────────────────────────────────────────
const stageInfo = {
  checkout: {
    tagline: 'Downloads your code onto the CI server',
    what: 'The pipeline starts here. It clones your Git repository so every stage that follows has access to your source code. Without this, the pipeline has nothing to work with.',
    command: 'git clone https://github.com/you/project.git\n# or via GitHub Actions:\nuses: actions/checkout@v4',
    realLife: 'Like opening your project folder before you start working — the pipeline needs the files first.',
    tip: 'Always the first stage. Everything downstream depends on it.',
    failsWhen: 'Repo is private and no access token is configured.',
  },
  install: {
    tagline: 'Downloads all project dependencies',
    what: 'Installs every package listed in package.json. Uses npm ci for a clean, reproducible install from the lock file — guaranteeing the exact same versions every run.',
    command: 'npm ci\n# (faster than npm install in CI — uses package-lock.json exactly)',
    realLife: 'Like downloading all the tools you need before starting a job. You wouldn\'t build furniture without the required tools.',
    tip: 'npm ci is preferred over npm install in CI — it\'s stricter and faster.',
    failsWhen: 'A package is missing from npm, the registry is down, or the lock file is out of sync.',
  },
  lint: {
    tagline: 'Checks code style and catches basic errors',
    what: 'Runs ESLint across all source files. Catches unused variables, wrong syntax, and style violations before they waste test time. Cheapest check — runs in seconds.',
    command: 'npm run lint\n# Checks every .js/.jsx file against your ESLint rules',
    realLife: 'Like spell-checking an essay before submitting it — catches obvious errors before a deeper review.',
    tip: 'Run lint before tests — fail fast on cheap errors first. Saves minutes on every pipeline run.',
    failsWhen: 'Any ESLint rule is violated. Fix the error, push again, pipeline retries.',
  },
  test: {
    tagline: 'Runs your automated test suite',
    what: 'Executes unit, integration, and/or E2E tests. If any test fails the pipeline stops completely — broken code cannot reach production. This is the most important stage.',
    command: 'npm test\n# Runs: unit tests → integration tests → E2E tests',
    realLife: 'Quality control on a production line. If a part fails the check, it never gets shipped to the customer.',
    tip: 'A failing test means the pipeline is working exactly as designed — it caught a bug before your users did.',
    failsWhen: 'Any assertion fails, a component renders incorrectly, or an API returns unexpected data.',
  },
  build: {
    tagline: 'Creates production-ready output files',
    what: 'Compiles and bundles your code into optimised files that browsers can run. For React + Vite this produces the dist/ folder with minified JS, CSS, and HTML. Never serve raw source to production.',
    command: 'npm run build\n# Output:\n# dist/index.html\n# dist/assets/index.js   (minified)\n# dist/assets/index.css  (minified)',
    realLife: 'Like printing a finished book from a Word document — the source is for editing, the output is for readers.',
    tip: 'Build once, deploy the same artifact everywhere. Never rebuild for each environment.',
    failsWhen: 'Type errors, missing imports, circular dependencies, or out-of-memory on large bundles.',
  },
  security: {
    tagline: 'Scans for known vulnerabilities in dependencies',
    what: 'Audits every package in node_modules against databases of known CVEs (Common Vulnerabilities and Exposures). Finds unsafe packages before they reach production and your users.',
    command: 'npm audit --audit-level=high\n# or with Snyk:\nsnyk test',
    realLife: 'Like a background check on every contractor entering your building. Most are fine — but you\'d want to know about the dangerous ones.',
    tip: 'Run on every PR, not just main. A vulnerability can be exploited the moment it ships.',
    failsWhen: 'A dependency has a known high or critical severity vulnerability (CVE score ≥ 7.0).',
  },
  docker: {
    tagline: 'Packages your app into a portable container',
    what: 'Builds a Docker image containing your app + Node.js runtime + all dependencies. The image runs identically on any machine, server, or cloud provider — eliminating "works on my machine" problems.',
    command: 'docker build -t myapp:$GIT_SHA .\ndocker push registry.example.com/myapp:$GIT_SHA\n# Tag with Git SHA — never use "latest" in production',
    realLife: 'Like shipping a product in a standardised container. The container works the same whether it\'s on a ship, truck, or train.',
    tip: 'Always tag images with the Git commit SHA. This lets you roll back to any previous version in seconds.',
    failsWhen: 'Dockerfile has errors, base image is unavailable, or registry credentials are wrong or expired.',
  },
  deploy: {
    tagline: 'Ships your app live — users see the new version',
    what: 'Pushes your built artifact (Docker image, static files, etc.) to your production server or cloud. After this stage completes, users are on the new version. This is the finish line.',
    command: '# Static site (Vercel / Netlify)\nvercel --prod\n\n# Docker to a server\ndocker run -d -p 80:3000 myapp:$GIT_SHA\n\n# Kubernetes\nkubectl set image deployment/app app=myapp:$GIT_SHA',
    realLife: 'Opening a shop after restocking the shelves. All the prep work is done — now customers can benefit from the changes.',
    tip: 'Always have a rollback plan. Since images are tagged by Git SHA, redeploying the previous version is a one-command fix.',
    failsWhen: 'Server unreachable, deploy credentials expired, health check fails, or not enough memory/CPU on the host.',
  },
}

// ── YAML generators ────────────────────────────────────────────────
const platforms = {
  github: {
    label: 'GitHub Actions',
    file: '.github/workflows/ci.yml',
    generate: (stageIds, cfg) => {
      const steps = stageIds.map(id => githubStep(id, cfg)).join('\n\n')
      return `name: ${cfg.pipelineName}\n\non:\n  push:\n    branches: [${cfg.branch}]\n  pull_request:\n    branches: [${cfg.branch}]\n\njobs:\n  pipeline:\n    runs-on: ubuntu-latest\n\n    steps:\n${steps}\n`
    },
  },
  gitlab: {
    label: 'GitLab CI',
    file: '.gitlab-ci.yml',
    generate: (stageIds, cfg) => {
      const names = stageIds.join('\n  - ')
      const jobs = stageIds.map(id => gitlabJob(id, cfg)).join('\n\n')
      return `stages:\n  - ${names}\n\n${jobs}\n`
    },
  },
  jenkins: {
    label: 'Jenkins',
    file: 'Jenkinsfile',
    generate: (stageIds, cfg) => {
      const blocks = stageIds.map(id => jenkinsBlock(id, cfg)).join('\n\n        ')
      return `pipeline {\n  agent any\n\n  environment {\n    NODE_VERSION = '${cfg.nodeVersion}'\n  }\n\n  stages {\n        ${blocks}\n  }\n}\n`
    },
  },
}

function githubStep(id, cfg) {
  const m = {
    checkout: `      - name: Checkout code\n        uses: actions/checkout@v4`,
    install:  `      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '${cfg.nodeVersion}'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci`,
    lint:     `      - name: Lint\n        run: npm run lint`,
    test:     `      - name: Run tests\n        run: npm test`,
    build:    `      - name: Build\n        run: npm run build`,
    security: `      - name: Security scan\n        uses: snyk/actions/node@master\n        env:\n          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}`,
    docker:   `      - name: Build & push Docker image\n        uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
    deploy:   `      - name: Deploy\n        run: echo "Add your deploy command here"\n        env:\n          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}`,
  }
  return m[id] || `      - name: ${id}\n        run: echo "${id}"`
}

function gitlabJob(id, cfg) {
  const m = {
    checkout: `# GitLab CI checks out code automatically`,
    install:  `install:\n  stage: install\n  image: node:${cfg.nodeVersion}\n  script:\n    - npm ci\n  cache:\n    key: \${CI_COMMIT_REF_SLUG}\n    paths:\n      - node_modules/`,
    lint:     `lint:\n  stage: lint\n  script:\n    - npm run lint`,
    test:     `test:\n  stage: test\n  script:\n    - npm test`,
    build:    `build:\n  stage: build\n  script:\n    - npm run build\n  artifacts:\n    paths:\n      - dist/`,
    security: `security:\n  stage: security\n  image: snyk/snyk:node\n  script:\n    - snyk test`,
    docker:   `docker:\n  stage: docker\n  image: docker:24\n  services:\n    - docker:dind\n  script:\n    - docker build -t \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA .\n    - docker push \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA`,
    deploy:   `deploy:\n  stage: deploy\n  script:\n    - echo "Deploy step — add your command here"\n  environment:\n    name: production`,
  }
  return m[id] || `${id}:\n  stage: ${id}\n  script:\n    - echo "${id}"`
}

function jenkinsBlock(id, cfg) {
  const m = {
    checkout: `stage('Checkout') {\n            steps { checkout scm }\n        }`,
    install:  `stage('Install') {\n            steps { sh 'npm ci' }\n        }`,
    lint:     `stage('Lint') {\n            steps { sh 'npm run lint' }\n        }`,
    test:     `stage('Test') {\n            steps { sh 'npm test' }\n        }`,
    build:    `stage('Build') {\n            steps { sh 'npm run build' }\n        }`,
    security: `stage('Security') {\n            steps { sh 'snyk test' }\n        }`,
    docker:   `stage('Docker') {\n            steps {\n                sh 'docker build -t myapp:\${BUILD_NUMBER} .'\n                sh 'docker push myapp:\${BUILD_NUMBER}'\n            }\n        }`,
    deploy:   `stage('Deploy') {\n            steps { sh 'echo "Add deploy command"' }\n        }`,
  }
  return m[id] || `stage('${id}') {\n            steps { sh 'echo "${id}"' }\n        }`
}

const HGAP = 220
const Y = 140
const defaultStageIds = ['checkout', 'install', 'test', 'build']

// ── Component ──────────────────────────────────────────────────────
export default function Builder() {
  const [platform, setPlatform]       = useState('github')
  const [copied, setCopied]           = useState(false)
  const [rightTab, setRightTab]       = useState('yaml')  // 'yaml' | 'guide'
  const [selectedId, setSelectedId]   = useState(null)
  const [counter, setCounter]         = useState(100)
  const [config, setConfig]           = useState({ pipelineName: 'CI/CD Pipeline', branch: 'main', nodeVersion: '20' })

  const removeNode = useCallback((id) => {
    setNodes(ns => {
      const updated = ns.filter(n => n.id !== id)
      setEdges(buildEdges(updated))
      return updated
    })
    setSelectedId(prev => prev === id ? null : prev)
  }, [])

  const makeNode = useCallback((sid, index) => {
    const type = stageTypes.find(s => s.id === sid)
    const id = `${sid}-${index}`
    return {
      id,
      type: 'pipeline',
      position: { x: 60 + index * HGAP, y: Y },
      data: { ...type, onRemove: () => removeNode(id) },
      draggable: true,
    }
  }, [removeNode])

  const initialNodes = useMemo(() =>
    defaultStageIds.map((sid, i) => makeNode(sid, i)),
  [])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(initialNodes))

  const onConnect = useCallback(
    (params) => setEdges(es => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    }, es)),
    [setEdges],
  )

  const onNodeClick = useCallback((_, node) => {
    setSelectedId(node.id)
    setRightTab('guide')
  }, [])

  const addStage = (stageType) => {
    const uid = `${stageType.id}-${Date.now()}-${counter}`
    setCounter(c => c + 1)
    setNodes(ns => {
      const x = ns.length > 0 ? Math.max(...ns.map(n => n.position.x)) + HGAP : 60
      const newNode = {
        id: uid,
        type: 'pipeline',
        position: { x, y: Y },
        data: { ...stageType, onRemove: () => removeNode(uid) },
        draggable: true,
      }
      const updated = [...ns, newNode]
      setEdges(buildEdges(updated))
      return updated
    })
  }

  const orderedIds = [...nodes].sort((a, b) => a.position.x - b.position.x).map(n => n.data.id)
  const yaml = platforms[platform].generate(orderedIds, config)

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

  const selectedNode  = nodes.find(n => n.id === selectedId)
  const selectedStage = selectedNode ? stageInfo[selectedNode.data.id] : null
  const selectedType  = selectedNode ? stageTypes.find(s => s.id === selectedNode.data.id) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Pipeline Builder</h1>
        <p className="text-slate-400">
          Click a stage to learn what it does · Drag nodes to reorder · Export as YAML
        </p>
      </div>

      {/* Platform selector */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {Object.entries(platforms).map(([key, p]) => (
          <button key={key} onClick={() => setPlatform(key)}
            className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              platform === key
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Config */}
      {platform === 'github' && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Pipeline name</label>
            <input className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
              value={config.pipelineName} onChange={e => setConfig(c => ({ ...c, pipelineName: e.target.value }))} />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Branch</label>
            <input className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
              value={config.branch} onChange={e => setConfig(c => ({ ...c, branch: e.target.value }))} />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Node.js version</label>
            <select className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
              value={config.nodeVersion} onChange={e => setConfig(c => ({ ...c, nodeVersion: e.target.value }))}>
              <option value="18">18 (LTS)</option>
              <option value="20">20 (LTS)</option>
              <option value="22">22 (latest)</option>
            </select>
          </div>
        </div>
      )}

      {/* Add stage buttons */}
      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-3">Add a stage:</p>
        <div className="flex flex-wrap gap-2">
          {stageTypes.map(type => (
            <button key={type.id} onClick={() => addStage(type)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${type.color}`}>
              <Plus size={13} /> {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas + Right panel */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* React Flow Canvas */}
        <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col" style={{ height: 440 }}>
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <span className="text-white text-sm font-semibold">Visual Editor</span>
            <span className="text-slate-500 text-xs flex items-center gap-1.5">
              <MousePointer size={11} /> click a node to learn what it does
            </span>
          </div>
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              style={{ background: '#0f1117' }}
              deleteKeyCode={null}
            >
              <Background color="#ffffff10" gap={24} />
              <Controls className="!bg-white/5 !border-white/10 !text-white" />
              <MiniMap nodeColor="#6366f1" maskColor="rgba(0,0,0,0.6)"
                style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)' }} />
            </ReactFlow>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col" style={{ height: 440 }}>

          {/* Tabs */}
          <div className="flex border-b border-white/10 flex-shrink-0">
            <button
              onClick={() => setRightTab('yaml')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                rightTab === 'yaml'
                  ? 'text-white border-indigo-500 bg-white/5'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}>
              <Code size={14} /> YAML Output
            </button>
            <button
              onClick={() => setRightTab('guide')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                rightTab === 'guide'
                  ? 'text-white border-indigo-500 bg-white/5'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}>
              <BookOpen size={14} /> Stage Guide
              {selectedStage && <span className="w-2 h-2 bg-indigo-400 rounded-full" />}
            </button>
          </div>

          {/* YAML tab */}
          {rightTab === 'yaml' && (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/20 flex-shrink-0">
                <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded">
                  {platforms[platform].file}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={downloadYAML}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
                    <Download size={13} /> Download
                  </button>
                  <button onClick={copyYAML}
                    className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10">
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <pre className="p-5 text-sm text-green-300 font-mono overflow-auto flex-1 leading-relaxed whitespace-pre">
                {yaml}
              </pre>
              <div className="px-4 py-3 border-t border-white/10 bg-black/10 flex items-start gap-2 flex-shrink-0">
                <Info size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">
                  Copy into your repo at <span className="font-mono text-slate-400">{platforms[platform].file}</span> and commit. Pipeline triggers automatically.
                </p>
              </div>
            </>
          )}

          {/* Stage Guide tab */}
          {rightTab === 'guide' && (
            <div className="flex-1 overflow-y-auto">
              {!selectedStage ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-4">
                  <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
                    <MousePointer className="text-indigo-400" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Click any stage node</p>
                    <p className="text-slate-400 text-sm">Select a node on the canvas to see a full explanation — what it does, the command it runs, and when it fails.</p>
                  </div>
                  {/* Quick overview of all stages */}
                  <div className="w-full mt-2 space-y-2 text-left">
                    {stageTypes.map(s => (
                      <div key={s.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm ${s.color}`}>
                        <span>{s.icon}</span>
                        <div>
                          <span className="font-medium">{s.label}</span>
                          <span className="text-slate-500 ml-2 text-xs">{stageInfo[s.id]?.tagline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {/* Stage header */}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${selectedType.color}`}>
                    <span className="text-2xl">{selectedType.icon}</span>
                    <div>
                      <p className="text-white font-bold text-lg">{selectedType.label}</p>
                      <p className="text-sm opacity-80">{selectedStage.tagline}</p>
                    </div>
                  </div>

                  {/* What it does */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen size={12} /> What it does
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedStage.what}</p>
                  </div>

                  {/* Command */}
                  <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/30">
                      <Code size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-400 font-mono">command</span>
                    </div>
                    <pre className="p-4 text-sm text-green-300 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                      {selectedStage.command}
                    </pre>
                  </div>

                  {/* Real life analogy */}
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Real life analogy</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedStage.realLife}</p>
                  </div>

                  {/* Pro tip */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                    <Lightbulb size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Pro tip</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{selectedStage.tip}</p>
                    </div>
                  </div>

                  {/* Fails when */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                    <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">Fails when</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{selectedStage.failsWhen}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Real life flow */}
      <div className="mt-8 bg-white/3 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <span className="text-lg">⚡</span> Real life — what happens when you push code
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {[
            { label: 'git push', color: 'bg-slate-700 text-slate-200' },
            { label: '→', color: 'text-slate-500' },
            { label: 'Checkout ✔', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
            { label: '→', color: 'text-slate-500' },
            { label: 'Install ✔', color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' },
            { label: '→', color: 'text-slate-500' },
            { label: 'Test ✔', color: 'bg-green-500/20 text-green-300 border border-green-500/30' },
            { label: '→', color: 'text-slate-500' },
            { label: 'Build ✔', color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
            { label: '→', color: 'text-slate-500' },
            { label: 'Deploy ✔', color: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
            { label: '→', color: 'text-slate-500' },
            { label: '🟢 Live in ~3 min', color: 'bg-green-600/20 text-green-300 border border-green-600/30' },
          ].map((item, i) => (
            item.label === '→'
              ? <span key={i} className={item.color}>{item.label}</span>
              : <span key={i} className={`px-3 py-1.5 rounded-lg font-medium ${item.color}`}>{item.label}</span>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-3">
          If any stage fails, the pipeline stops and your code never reaches production. Green across the board = safe to ship.
        </p>
      </div>
    </div>
  )
}

function buildEdges(nodes) {
  return nodes.slice(0, -1).map((n, i) => ({
    id: `e${i}`,
    source: nodes[i].id,
    target: nodes[i + 1].id,
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
  }))
}
