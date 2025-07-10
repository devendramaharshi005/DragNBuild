import { Handle, Position, type NodeProps } from "reactflow"
import { Square } from "lucide-react"

export function EndNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <Square className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <div className="text-xs text-gray-600 font-medium">END</div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-500 border-2 border-white" />
    </div>
  )
}
