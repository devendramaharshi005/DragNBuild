import { Handle, Position, type NodeProps } from "reactflow"
import { Brain } from "lucide-react"

export function AINode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? "border-blue-500" : "border-purple-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="text-xs text-purple-600 font-medium">AI AGENT</div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500 border-2 border-white" />

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500 border-2 border-white" />
    </div>
  )
}
