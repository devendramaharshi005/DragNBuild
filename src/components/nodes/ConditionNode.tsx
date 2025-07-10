import { Handle, Position, type NodeProps } from "reactflow"
import { GitBranch } from "lucide-react"

export function ConditionNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? "border-blue-500" : "border-yellow-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-yellow-600" />
        </div>
        <div>
          <div className="text-xs text-yellow-600 font-medium">CONDITION</div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-500 border-2 border-white" />

      <div className="flex justify-between mt-2">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 bg-green-500 border-2 border-white"
          style={{ left: "25%" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 bg-red-500 border-2 border-white"
          style={{ left: "75%" }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>True</span>
        <span>False</span>
      </div>
    </div>
  )
}
