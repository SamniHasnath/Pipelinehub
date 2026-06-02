import { GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <GitBranch className="text-indigo-400" size={18} />
          PipelineHub
        </div>
        <div className="flex gap-6 text-sm text-slate-400">
          <Link to="/learn"   className="hover:text-white transition-colors">Learn</Link>
          <Link to="/builder" className="hover:text-white transition-colors">Builder</Link>
          <Link to="/tools"   className="hover:text-white transition-colors">Tools</Link>
          <Link to="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
        </div>
        <p className="text-slate-500 text-sm">
          © 2026 PipelineHub • Designed & Developed by Samni Hasnath
        </p>
      </div>
    </footer>
  )
}