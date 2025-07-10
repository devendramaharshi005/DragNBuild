import { Handle, Position, type NodeProps } from "reactflow"
import { Play } from "lucide-react"

export function TriggerNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? "border-blue-500" : "border-green-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="text-xs text-green-600 font-medium">NEW TICKET</div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </div>
  )
}
