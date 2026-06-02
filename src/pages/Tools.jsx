import { useState } from 'react'
import { ExternalLink, Star, Check, X } from 'lucide-react'

const tools = [
  {
    name: 'GitHub Actions',
    emoji: '🐙',
    type: 'Cloud',
    pricing: 'Free for public repos',
    freeTier: '2,000 min/month free',
    bestFor: 'GitHub users',
    speed: 'Fast',
    difficulty: 'Easy',
    stars: 5,
    desc: 'Built directly into GitHub — no separate account or configuration needed. The largest marketplace of reusable actions. Best choice for most developers starting out.',
    pros: ['Zero setup if you use GitHub', 'Huge actions marketplace', 'Great docs and community', 'Native secret management', 'Matrix builds built-in'],
    cons: ['Tied to GitHub ecosystem', 'Costs can rise on large teams', 'Limited self-hosting options'],
    url: 'https://github.com/features/actions',
    tags: ['Cloud', 'Free tier', 'Popular'],
    color: 'border-gray-500/30 hover:border-gray-400/50',
    badge: 'Most Popular',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    name: 'GitLab CI',
    emoji: '🦊',
    type: 'Cloud / Self-hosted',
    pricing: 'Free tier available',
    freeTier: '400 min/month free',
    bestFor: 'GitLab users',
    speed: 'Fast',
    difficulty: 'Easy',
    stars: 5,
    desc: 'Deeply integrated with GitLab. Supports Auto DevOps which can auto-detect and configure a pipeline for many project types. Excellent self-hosting story.',
    pros: ['Auto DevOps out of the box', 'Built-in container registry', 'Excellent self-hosting', 'Security scanning included', 'Review apps feature'],
    cons: ['Best only with GitLab repos', 'Free tier minutes are limited', 'UI can be overwhelming'],
    url: 'https://docs.gitlab.com/ee/ci/',
    tags: ['Cloud', 'Self-host', 'Free tier'],
    color: 'border-orange-500/30 hover:border-orange-400/50',
  },
  {
    name: 'Jenkins',
    emoji: '🏗️',
    type: 'Self-hosted',
    pricing: 'Free (open source)',
    freeTier: 'Unlimited (you host it)',
    bestFor: 'Enterprise / custom',
    speed: 'Depends on hardware',
    difficulty: 'Hard',
    stars: 3,
    desc: 'The veteran CI/CD tool with 15+ years of history. Extremely flexible with 1,800+ plugins. Requires a dedicated team to maintain. Common in large enterprises.',
    pros: ['Completely free and open source', '1,800+ plugins', 'Full control over infrastructure', 'Language/platform agnostic', 'Huge community'],
    cons: ['Needs its own server to run', 'Steep learning curve', 'Plugin conflicts are common', 'UI is outdated', 'Security patching is your job'],
    url: 'https://www.jenkins.io',
    tags: ['Self-host', 'Open source', 'Enterprise'],
    color: 'border-red-500/30 hover:border-red-400/50',
  },
  {
    name: 'CircleCI',
    emoji: '⭕',
    type: 'Cloud',
    pricing: 'Free tier (6,000 min/mo)',
    freeTier: '6,000 min/month free',
    bestFor: 'Fast builds',
    speed: 'Very Fast',
    difficulty: 'Medium',
    stars: 4,
    desc: 'Known for raw speed and a Docker-first approach. Excellent parallelism support lets you split a test suite across dozens of containers. Popular in FinTech and startups.',
    pros: ['Fastest build speeds', 'Great parallelism', 'Docker-first design', 'Orbs (reusable packages)', 'Advanced caching'],
    cons: ['Pricier at scale', 'Less GitHub-native than Actions', 'Config syntax takes time to learn'],
    url: 'https://circleci.com',
    tags: ['Cloud', 'Free tier', 'Fast'],
    color: 'border-green-500/30 hover:border-green-400/50',
  },
  {
    name: 'ArgoCD',
    emoji: '🐙',
    type: 'Self-hosted',
    pricing: 'Free (open source)',
    freeTier: 'Unlimited (Kubernetes)',
    bestFor: 'Kubernetes GitOps',
    speed: 'N/A (CD only)',
    difficulty: 'Hard',
    stars: 5,
    desc: 'GitOps continuous delivery for Kubernetes. ArgoCD continuously syncs your cluster to match what is declared in a Git repo — the cluster is your source of truth.',
    pros: ['True GitOps model', 'Visual cluster state UI', 'Automatic drift detection', 'Multi-cluster support', 'CNCF graduated project'],
    cons: ['Kubernetes-only', 'Steep K8s prerequisite', 'CD only — pair with CI tool'],
    url: 'https://argoproj.github.io/cd',
    tags: ['Kubernetes', 'GitOps', 'Open source'],
    color: 'border-blue-500/30 hover:border-blue-400/50',
    badge: 'CNCF',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    name: 'Drone CI',
    emoji: '🚁',
    type: 'Cloud / Self-hosted',
    pricing: 'Free (open source)',
    freeTier: 'Unlimited (self-hosted)',
    bestFor: 'Container-native',
    speed: 'Fast',
    difficulty: 'Medium',
    stars: 4,
    desc: 'Container-native CI where every step runs in an isolated Docker container. Simple, clean YAML. Very lightweight to self-host. Popular with teams that love containers.',
    pros: ['Every step is isolated in Docker', 'Simple YAML syntax', 'Lightweight to self-host', 'Plugin ecosystem', 'Works with GitHub / GitLab / Gitea'],
    cons: ['Smaller community than Jenkins/Actions', 'Less enterprise features', 'Harness acquisition caused some turbulence'],
    url: 'https://www.drone.io',
    tags: ['Docker', 'Self-host', 'Lightweight'],
    color: 'border-cyan-500/30 hover:border-cyan-400/50',
  },
  {
    name: 'Tekton',
    emoji: '⚙️',
    type: 'Self-hosted',
    pricing: 'Free (open source)',
    freeTier: 'Unlimited (Kubernetes)',
    bestFor: 'Kubernetes-native CI',
    speed: 'Fast',
    difficulty: 'Expert',
    stars: 4,
    desc: 'A Kubernetes-native CI/CD framework where pipelines are defined as Kubernetes custom resources. Powers Red Hat OpenShift pipelines. Very powerful, very complex.',
    pros: ['Kubernetes-native (CRDs)', 'Reusable Tasks and Pipelines', 'CNCF project', 'Foundation for other tools', 'Cloud-agnostic'],
    cons: ['Requires Kubernetes knowledge', 'Very verbose YAML', 'No built-in UI (need dashboard separately)', 'Overkill for most teams'],
    url: 'https://tekton.dev',
    tags: ['Kubernetes', 'Open source', 'Enterprise'],
    color: 'border-purple-500/30 hover:border-purple-400/50',
  },
  {
    name: 'Travis CI',
    emoji: '🔵',
    type: 'Cloud',
    pricing: 'Paid (free tier ended)',
    freeTier: 'No free tier',
    bestFor: 'Legacy open source',
    speed: 'Medium',
    difficulty: 'Easy',
    stars: 3,
    desc: 'One of the first cloud CI services, extremely popular with open source projects through 2020. Since being acquired and ending the open source free tier, many projects have migrated away.',
    pros: ['Simple .travis.yml syntax', 'Good multi-language support', 'Build matrix support', 'Long history of documentation'],
    cons: ['No longer free for open source', 'Losing market share fast', 'Consider GitHub Actions instead'],
    url: 'https://www.travis-ci.com',
    tags: ['Cloud', 'Legacy'],
    color: 'border-slate-500/30 hover:border-slate-400/50',
  },
]

const filters = ['All', 'Cloud', 'Self-host', 'Kubernetes', 'Free tier', 'Open source']

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={13}
          className={i <= count ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
        />
      ))}
    </div>
  )
}

export default function Tools() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const visible = filter === 'All'
    ? tools
    : tools.filter(t => t.tags.some(tag => tag.toLowerCase() === filter.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Tools Explorer</h1>
        <p className="text-slate-400">Compare the most popular CI/CD tools — pricing, speed, difficulty, pros and cons.</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 text-xs opacity-60">
                {tools.filter(t => t.tags.some(tag => tag.toLowerCase() === f.toLowerCase())).length}
              </span>
            )}
          </button>
        ))}
        <span className="text-slate-500 text-sm self-center ml-2">{visible.length} tools</span>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {visible.map((tool) => (
          <div
            key={tool.name}
            className={`bg-white/4 border rounded-2xl overflow-hidden transition-all ${tool.color} ${expanded === tool.name ? 'shadow-xl' : ''}`}
          >
            {/* Card header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tool.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-lg">{tool.name}</h3>
                      {tool.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars count={tool.stars} />
                      <span className="text-slate-500 text-xs">{tool.type}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4">{tool.desc}</p>

              {/* Quick facts */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                {[
                  { label: 'Pricing', value: tool.pricing },
                  { label: 'Free tier', value: tool.freeTier },
                  { label: 'Best for', value: tool.bestFor },
                  { label: 'Difficulty', value: tool.difficulty },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 rounded-lg p-2.5">
                    <div className="text-slate-500 mb-0.5">{label}</div>
                    <div className="text-slate-200 font-medium">{value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/8 text-slate-400 px-2 py-1 rounded-md border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setExpanded(expanded === tool.name ? null : tool.name)}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                {expanded === tool.name ? '↑ Hide details' : '↓ Show pros & cons'}
              </button>
            </div>

            {/* Expanded pros/cons */}
            {expanded === tool.name && (
              <div className="px-6 pb-6 border-t border-white/10 pt-5 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Check size={13} /> Pros
                  </h4>
                  <ul className="space-y-1.5">
                    {tool.pros.map(p => (
                      <li key={p} className="text-slate-300 text-xs flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <X size={13} /> Cons
                  </h4>
                  <ul className="space-y-1.5">
                    {tool.cons.map(c => (
                      <li key={c} className="text-slate-300 text-xs flex items-start gap-1.5">
                        <span className="text-red-500 mt-0.5 flex-shrink-0">−</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
