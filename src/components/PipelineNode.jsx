import { Handle, Position } from '@xyflow/react'
import { Trash2 } from 'lucide-react'

export default function PipelineNode({ data }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border min-w-[160px] shadow-lg ${data.color} relative group`}>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-900"
      />
      <span className="text-base">{data.icon}</span>
      <span className="font-semibold text-sm whitespace-nowrap">{data.label}</span>
      <button
        onClick={data.onRemove}
        className="ml-auto opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-0.5"
      >
        <Trash2 size={13} />
      </button>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-900"
      />
    </div>
  )
}
