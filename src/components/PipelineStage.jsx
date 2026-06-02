import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'

export default function PipelineStage({ stage, index, total, onMoveUp, onMoveDown, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {index + 1}
        </div>
        {index < total - 1 && (
          <div className="w-0.5 h-3 bg-white/15 mt-0.5" />
        )}
      </div>
      <div className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl border ${stage.color}`}>
        <span className="font-medium text-sm flex items-center gap-2">
          <span>{stage.icon}</span>
          {stage.label}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 opacity-40 hover:opacity-100 disabled:opacity-20 transition-opacity"
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1 opacity-40 hover:opacity-100 disabled:opacity-20 transition-opacity"
          >
            <ChevronDown size={13} />
          </button>
          <button
            onClick={onRemove}
            className="p-1 opacity-40 hover:opacity-100 text-red-400 transition-opacity ml-1"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
